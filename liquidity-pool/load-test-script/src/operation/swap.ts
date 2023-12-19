import { Networks, Address, Contract, Keypair, TransactionBuilder, nativeToScVal, xdr, SorobanRpc } from 'soroban-client'
import { server } from '../shared/contracts';
import { LogTransaction } from '../shared/log';

export async function swap(sourceSecretKey: string, contractId: string, buyA: boolean, out: number, inMax: number) {
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey);
    const sourcePublicKey = sourceKeypair.publicKey();
    const account = await server.getAccount(sourcePublicKey);

    // Right now, this is just the default fee for this example.
    const fee = Math.floor(Math.random() * 10000) + 1;

    const to = new Address(sourcePublicKey).toScVal()
    const buyAScVal = nativeToScVal(Boolean(buyA))
    const outScVal = nativeToScVal(Number(out), { type: 'i128' })
    const inMaxBScVal = nativeToScVal(Number(inMax), { type: 'i128' })

    const log = new LogTransaction()
    try {
        console.log('Swap to:', sourcePublicKey);

        const contract = new Contract(contractId);
        const transactionBuilder = new TransactionBuilder(account, {
            fee: fee.toString(),
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(contract.call("swap", to, buyAScVal, outScVal, inMaxBScVal))
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
                await log.save(contractId, 'swap', sourcePublicKey, '', "FAILED", error, fee)
                return
            }
        }
        console.log('Swap status:', getTransactionResponse.status);
        await log.save(contractId, 'swap', sourcePublicKey, '', getTransactionResponse.status, '', fee)
    } catch (e) {
        console.log('An error has occurred:');
        console.log(e);
        await log.save(contractId, 'swap', sourcePublicKey, '', "FAILED", e, fee)
    }
};