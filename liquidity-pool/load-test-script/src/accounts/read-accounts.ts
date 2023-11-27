import fs from 'fs';

function readDirectoryFiles(directoryPath: string): string[] {
    try {
        const files = fs.readdirSync(directoryPath);
        return files;
    } catch (error) {
        console.error('Error reading directory:', error);
        return [];
    }
}

function readFileByName(fileName: string): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.toString().trimEnd());
            }
        });
    });
}

export async function readAccountsSecret(): Promise<string[]> {
    const directoryPath = 'data/.accounts/';
    const filesInDirectory = readDirectoryFiles(directoryPath);

    const filesSecret = filesInDirectory.filter(file => file.endsWith('-secret'))
    let secrets = []
    const secretsPromise = filesSecret.map(file =>
        readFileByName(directoryPath + file))

    secrets = await Promise.all(secretsPromise)
    return secrets
}