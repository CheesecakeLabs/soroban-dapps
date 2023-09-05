import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, addressToScVal, i128ToScVal } from './convert.js';
import { invoke } from './invoke.js';
export * from './constants.js';
export * from './server.js';
export * from './invoke.js';
;
;
export class Ok {
    value;
    constructor(value) {
        this.value = value;
    }
    unwrapErr() {
        throw new Error('No error');
    }
    unwrap() {
        return this.value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return !this.isOk();
    }
}
export class Err {
    error;
    constructor(error) {
        this.error = error;
    }
    unwrapErr() {
        return this.error;
    }
    unwrap() {
        throw new Error(this.error.message);
    }
    isOk() {
        return false;
    }
    isErr() {
        return !this.isOk();
    }
}
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
const regex = /ContractError\((\d+)\)/;
function getError(err) {
    const match = err.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors == undefined) {
        return undefined;
    }
    // @ts-ignore
    let i = parseInt(match[1], 10);
    if (i < Errors.length) {
        return new Err(Errors[i]);
    }
    return undefined;
}
export async function initialize({ contractId, token_wasm_hash, token_a, token_b }, options = {}) {
    return await invoke(contractId, {
        method: 'initialize',
        args: [((i) => xdr.ScVal.scvBytes(i))(token_wasm_hash),
            ((i) => addressToScVal(i))(token_a),
            ((i) => addressToScVal(i))(token_b)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function shareId({ contractId }, options = {}) {
    return await invoke(contractId, {
        method: 'share_id',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function deposit({ contractId, to, desired_a, min_a, desired_b, min_b }, options = {}) {
    return await invoke(contractId, {
        method: 'deposit',
        args: [((i) => addressToScVal(i))(to),
            ((i) => i128ToScVal(i))(desired_a),
            ((i) => i128ToScVal(i))(min_a),
            ((i) => i128ToScVal(i))(desired_b),
            ((i) => i128ToScVal(i))(min_b)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function swap({ contractId, to, buy_a, out, in_max }, options = {}) {
    return await invoke(contractId, {
        method: 'swap',
        args: [((i) => addressToScVal(i))(to),
            ((i) => xdr.ScVal.scvBool(i))(buy_a),
            ((i) => i128ToScVal(i))(out),
            ((i) => i128ToScVal(i))(in_max)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function withdraw({ contractId, to, share_amount, min_a, min_b }, options = {}) {
    return await invoke(contractId, {
        method: 'withdraw',
        args: [((i) => addressToScVal(i))(to),
            ((i) => i128ToScVal(i))(share_amount),
            ((i) => i128ToScVal(i))(min_a),
            ((i) => i128ToScVal(i))(min_b)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function getRsrvs({ contractId }, options = {}) {
    return await invoke(contractId, {
        method: 'get_rsrvs',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function getShares({ contractId }, options = {}) {
    return await invoke(contractId, {
        method: 'get_shares',
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
const Errors = [];
