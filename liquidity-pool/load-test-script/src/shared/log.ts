import fs from 'fs';

export class LogTransaction {
    initTime: string
    endTIme: string
    logFile: string = 'data/invoke-log.csv'

    constructor() {
        const now: Date = new Date();
        const hours: number = now.getHours();
        const minutes: number = now.getMinutes();
        const seconds: number = now.getSeconds();
        this.initTime = `${hours}:${minutes}:${seconds}`
    }

    async saveInFile(data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.appendFile(this.logFile, data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async save(contractId: string, functionName: string, invokerSk: string, args: string, output: string, result: string, fee: number) {
        const now: Date = new Date();
        const hours: number = now.getHours();
        const minutes: number = now.getMinutes();
        const seconds: number = now.getSeconds();
        this.endTIme = `${hours}:${minutes}:${seconds}`

        const dataLog = `${contractId},${functionName},${invokerSk},${args},${output},${result},${this.initTime},${this.endTIme},${fee}\n`
        await this.saveInFile(dataLog)
    }
}
