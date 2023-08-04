export function formatAmount(undivided: BigInt, decimals: number): string {
    const n = undivided.valueOf() < BigInt(Number.MAX_SAFE_INTEGER)
        ? Number(undivided) / (10 ** decimals)
        : (undivided.valueOf() / (10n ** BigInt(decimals)));
    return String(n);
}

const Utils = {
    formatAmount,
}

export { Utils }
