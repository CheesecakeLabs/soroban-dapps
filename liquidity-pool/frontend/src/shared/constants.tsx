const TOKEN_A_ADMIN = (import.meta.env.VITE_TOKEN_A_ADMIN_ADDRESS ?? '').toUpperCase();
const TOKEN_A_ADMIN_SECRET_KEY = (import.meta.env.VITE_TOKEN_A_ADMIN_SECRET ?? '').toUpperCase();

const TOKEN_B_ADMIN = (import.meta.env.VITE_TOKEN_B_ADMIN_ADDRESS ?? '').toUpperCase();
const TOKEN_B_ADMIN_SECRET_KEY = (import.meta.env.VITE_TOKEN_B_ADMIN_SECRET ?? '').toUpperCase();

const LIQUIDITY_POOL_ID = (import.meta.env.VITE_LIQUIDITY_POOL_ID ?? '').toUpperCase();
const TOKEN_A_ID = (import.meta.env.VITE_TOKEN_A_ID ?? '').toUpperCase();
const TOKEN_B_ID = (import.meta.env.VITE_TOKEN_B_ID ?? '').toUpperCase();
const SHARE_ID = (import.meta.env.VITE_TOKEN_SHARE_ID ?? '').toUpperCase();

const Constants = {
    LIQUIDITY_POOL_ID,
    TOKEN_A_ADMIN,
    TOKEN_A_ADMIN_SECRET_KEY,
    TOKEN_B_ADMIN,
    TOKEN_B_ADMIN_SECRET_KEY,
    TOKEN_A_ID,
    TOKEN_B_ID,
    SHARE_ID
};


export { Constants };
