"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShares = exports.getRsrvs = exports.withdraw = exports.swap = exports.deposit = exports.shareId = exports.initialize = exports.Err = exports.Ok = void 0;
const soroban_client_1 = require("soroban-client");
const buffer_1 = require("buffer");
const convert_js_1 = require("./convert.js");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./constants.js"), exports);
__exportStar(require("./server.js"), exports);
__exportStar(require("./invoke.js"), exports);
;
;
class Ok {
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
exports.Ok = Ok;
class Err {
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
exports.Err = Err;
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || buffer_1.Buffer;
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
async function initialize({ contractId, token_wasm_hash, token_a, token_b }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'initialize',
        args: [((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(token_wasm_hash),
            ((i) => (0, convert_js_1.addressToScVal)(i))(token_a),
            ((i) => (0, convert_js_1.addressToScVal)(i))(token_b)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.initialize = initialize;
async function shareId({ contractId }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'share_id',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.shareId = shareId;
async function deposit({ contractId, to, desired_a, min_a, desired_b, min_b }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'deposit',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(desired_a),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(min_a),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(desired_b),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(min_b)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.deposit = deposit;
async function swap({ contractId, to, buy_a, out, in_max }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'swap',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => soroban_client_1.xdr.ScVal.scvBool(i))(buy_a),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(out),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(in_max)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.swap = swap;
async function withdraw({ contractId, to, share_amount, min_a, min_b }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'withdraw',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(share_amount),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(min_a),
            ((i) => (0, convert_js_1.i128ToScVal)(i))(min_b)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.withdraw = withdraw;
async function getRsrvs({ contractId }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'get_rsrvs',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.getRsrvs = getRsrvs;
async function getShares({ contractId }, options = {}) {
    return await (0, invoke_js_1.invoke)(contractId, {
        method: 'get_shares',
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.getShares = getShares;
const Errors = [];
