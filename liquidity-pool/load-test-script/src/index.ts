
import { readAccountsSecret } from './accounts/read-accounts';
import { deposit } from './operation/deposit';
import { get_rsrvs } from './operation/get_rsrvs';
import { swap } from './operation/swap';
import { withdraw } from './operation/withdraw';
import { readContractId } from './shared/contracts';

async function load_test() {
    const swapAmount = 100000
    const totalExecution = 10
    const secrets = await readAccountsSecret()
    const contractId = await readContractId()

    for (let execution = 1; execution < totalExecution + 1; execution++) {
        console.log("Execution:", execution)
        await executeDeposit(secrets, contractId)
        await executeSwap(secrets, contractId, swapAmount)
        await executeWithdraw(secrets, contractId)
        await executeGetRsrvs(secrets, contractId)
    }
}

async function executeDeposit(secrets, contractId) {
    console.log("Start deposit")
    const depositAllUsers = secrets.map(secret =>
        deposit(secret, contractId, 100000000, 10000000, 100000000, 10000000)
    );
    await Promise.all(depositAllUsers);
}

async function executeSwap(secrets, contractId, swapAmount) {
    console.log("Start swap")
    const swapAllUsers = secrets.map(secret =>
        swap(secret, contractId, true, swapAmount, 9999999999999999));
    await Promise.all(swapAllUsers);
}

async function executeWithdraw(secrets, contractId) {
    console.log("Start withdraw")
    const withdrawAllUsers = secrets.map(secret =>
        withdraw(secret, contractId, 100000000, 10000000, 10000000)
    );
    await Promise.all(withdrawAllUsers);
}

async function executeGetRsrvs(secrets, contractId) {
    console.log("Start get_rsrvs")
    const getRsrvsAllUsers = secrets.map(secret =>
        get_rsrvs(secret, contractId)
    );
    await Promise.all(getRsrvsAllUsers);
}

load_test();
