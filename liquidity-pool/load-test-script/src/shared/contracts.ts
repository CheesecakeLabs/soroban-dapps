
import fs from 'fs';
import { Server } from 'soroban-client'
const config = {
    "network": "testnet",
    "rpcUrl": "https://soroban-testnet.stellar.org:443",
    "networkPassphrase": "Test SDF Network ; September 2015"
}
export const { network, rpcUrl, networkPassphrase } = config
export const server = new Server(rpcUrl)

export function readContractId(): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile("data/amm-deploy-out", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString().trimEnd());
            }
        });
    });
}