const TOKEN_1_ADMIN = (process.env.REACT_APP_TOKEN_1_ADMIN_ADDRESS ?? '').toUpperCase();
const TOKEN_1_ADMIN_SECRET_KEY = (process.env.REACT_APP_TOKEN_1_ADMIN_SECRET ?? '').toUpperCase();

const TOKEN_2_ADMIN = (process.env.REACT_APP_TOKEN_2_ADMIN_ADDRESS ?? '').toUpperCase();
const TOKEN_2_ADMIN_SECRET_KEY = (process.env.REACT_APP_TOKEN_2_ADMIN_SECRET ?? '').toUpperCase();

const LIQUIDITY_POOL_ID = (process.env.REACT_APP_LIQUIDITY_POOL_ID ?? '').toUpperCase();
const TOKEN_1_ID = (process.env.REACT_APP_TOKEN_1_ID ?? '').toUpperCase();
const TOKEN_2_ID = (process.env.REACT_APP_TOKEN_2_ID ?? '').toUpperCase();
const SHARE_ID = (process.env.REACT_APP_TOKEN_SHARE_ID ?? '').toUpperCase();

const Constants = {
    LIQUIDITY_POOL_ID,
    TOKEN_1_ADMIN,
    TOKEN_1_ADMIN_SECRET_KEY,
    TOKEN_2_ADMIN,
    TOKEN_2_ADMIN_SECRET_KEY,
    TOKEN_1_ID,
    TOKEN_2_ID,
    SHARE_ID
};


export { Constants };
