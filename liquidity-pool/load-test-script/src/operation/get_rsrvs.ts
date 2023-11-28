import { Networks, SorobanRpc, Contract, Keypair, TransactionBuilder } from 'soroban-client'
import { server } from '../shared/contracts';
import { LogTransaction } from '../shared/log';

export async function get_rsrvs(sourceSecretKey: string, contractId: string) {
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey);
    const sourcePublicKey = sourceKeypair.publicKey();
    const account = await server.getAccount(sourcePublicKey);

    // Right now, this is just the default fee for this example.
    const fee = Math.floor(Math.random() * 10000) + 1;
    const log = new LogTransaction()
    try {
        console.log('Get resources:', sourcePublicKey);

        const contract = new Contract(contractId);
        const transactionBuilder = new TransactionBuilder(account, {
            fee: fee.toString(),
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(contract.call("get_rsrvs"))
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
                await log.save(contractId, 'get_rsrvs', sourcePublicKey, '', "FAILED", error, fee)
                return
            }
        }
        console.log('Get resources status:', getTransactionResponse.status);
        await log.save(contractId, 'get_rsrvs', sourcePublicKey, '', getTransactionResponse.status, '', fee)
    } catch (e) {
        await log.save(contractId, 'get_rsrvs', sourcePublicKey, '', "FAILED", e, fee)
        console.log('An error has occurred:');
        console.log(e);
    }
};