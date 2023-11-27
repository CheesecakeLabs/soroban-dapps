import { Networks, Address, Contract, Keypair, TransactionBuilder, nativeToScVal, xdr, SorobanRpc } from 'soroban-client'
import { server } from '../shared/contracts';
import { LogTransaction } from '../shared/log';

export async function deposit(sourceSecretKey: string, contractId: string, desiredA: number, minA: number, desiredB: number, minB: number) {
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey);
    const sourcePublicKey = sourceKeypair.publicKey();
    const account = await server.getAccount(sourcePublicKey);

    // Right now, this is just the default fee for this example.
    const fee = 100;

    const to = new Address(sourcePublicKey).toScVal()
    const desiredAScVal = nativeToScVal(Number(desiredA), { type: 'i128' })
    const minAScVal = nativeToScVal(Number(minA), { type: 'i128' })
    const desiredBScVal = nativeToScVal(Number(desiredB), { type: 'i128' })
    const minBScVal = nativeToScVal(Number(minB), { type: 'i128' })

    const log = new LogTransaction()
    try {
        console.log('Deposit to: ', sourcePublicKey);

        const contract = new Contract(contractId);
        const transactionBuilder = new TransactionBuilder(account, {
            fee: fee.toString(),
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(contract.call("deposit", to, desiredAScVal, minAScVal, desiredBScVal, minBScVal))
            .setTimeout(30)
            .build();
        const transaction = await server.prepareTransaction(transactionBuilder);

        transaction.sign(sourceKeypair);
        const secondsToWait = 60
        const waitUntil = new Date(Date.now() + secondsToWait * 1000).valueOf();

        let waitTime = 1000;
        let exponentialFactor = 1.5;

        let sendTransactionResponse = await server.sendTransaction(transaction);
        let getTransactionResponse = await server.getTransaction(
            sendTransactionResponse.hash
        );
        while (Date.now() < waitUntil && getTransactionResponse.status === SorobanRpc.GetTransactionStatus.NOT_FOUND) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                waitTime = waitTime * exponentialFactor;
                getTransactionResponse = await server.getTransaction(sendTransactionResponse.hash);
            } catch (error) {
                await log.save(contractId, 'deposit', sourcePublicKey, '', "FAILED", error, fee)
                return
            }
        }
        console.log('Deposit status:', getTransactionResponse.status);
        await log.save(contractId, 'deposit', sourcePublicKey, '', getTransactionResponse.status, '', fee)
    } catch (error) {
        console.log('An error has occurred:');
        console.log(error);
        await log.save(contractId, 'deposit', sourcePublicKey, '', "FAILED", error, fee)
    }
};