import { StellarPlus } from "stellar-plus";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { DemoUser } from "../simulation-types";
import { FeeBumpHeader } from "./types";

// ======================================================
export type SetupDemoUsersArgs = {
  nOfUsers: number;
  network: Network;
  addTrustline?: AddTrustlineArgs[];
  fee?: string;
  timeout?: number;
  feeBump?: FeeBumpHeader;
};

/**
 *
 * @args {SetupDemoUsersArgs} args
 * @param { number } args.nOfUsers - number of users to create
 * @param { Network } args.network - network to use
 * @param { AddTrustlineArgs[]= } args.addTrustline - array of trustlines to add to users
 * @param { string= } args.fee - fee to use for user transaction invocation
 * @param { number= } args.timeout - timeout to use for user transaction invocation
 *
 * @returns  { Promise<DemoUser[]> } - array of demo users
 *
 * @description Creates demo users and initializes their accounts using friendbot. When addTrustline is provided, it adds the trustline to the users and mints the amount specified in mintAmount.
 */
export const setupDemoUsers = async (
  args: SetupDemoUsersArgs
): Promise<DemoUser[]> => {
  const users: DemoUser[] = [];
  for (let i = 0; i < args.nOfUsers; i++) {
    const user = new StellarPlus.Account.DefaultAccountHandler({
      network: args.network,
    });
    users.push({
      account: user,
      transactionInvocation: {
        header: {
          source: user.getPublicKey(),
          fee: args.fee || "1000000", //0.1 XLM as maximum fee
          timeout: args.timeout || 30, // 30 seconds
        },
        signers: [user],
        feeBump: args.feeBump,
      },
    });

    console.log(`Creating demo user ${i + 1}: `, user.getPublicKey());
  }

  const promises = [
    ...users.map(
      (user) => user.account.friendbot?.initialize() as Promise<void>
    ),
  ];

  await Promise.all(promises).then(() => {
    console.log("Demo users accounts initialized!");
  });

  if (args.addTrustline) {
    for (let i = 0; i < args.addTrustline.length; i++) {
      const { asset, mintAmount } = args.addTrustline[i];
      await addTrustlinesToUsers({ users, asset, mintAmount });
    }
  }

  return users;
};

// ======================================================
export type AddTrustlineArgs = {
  asset: StellarPlus.Asset.ClassicAssetHandler;
  mintAmount: string;
};

/**
 *
 * @args {AddTrustlineArgs} args
 * @param { DemoUser[] } args.users - array of demo users
 * @param { StellarPlus.Asset.ClassicAssetHandler } args.asset - Classic Asset Handler for the asset to add trustline to the users
 * @param { string } args.mintAmount - amount to mint to users
 *
 * @returns  { Promise<void> } - void
 *
 * @description Adds trustlines to users and mints the amount specified in mintAmount.
 *
 * */
export const addTrustlinesToUsers = async (
  args: {
    users: DemoUser[];
  } & AddTrustlineArgs
): Promise<void> => {
  const { users, asset, mintAmount } = args;
  console.log(`Adding trustlines to ${users.length} users...`);
  const promises = users.map((user) =>
    asset.addTrustlineAndMint({
      ...user.transactionInvocation,
      amount: mintAmount,
      to: user.account.getPublicKey(),
    })
  );

  await Promise.all(promises).then(() => {
    console.log("Trustlines added!");
  });
};

// ======================================================

export type MintSorobanTokensToUsers = {
  users: DemoUser[];
  issuer: DemoUser;
  token: StellarPlus.Asset.SorobanTokenHandler;
  mintAmount: string;
};

/**
 *
 * @args {MintSorobanTokensToUsers} args
 * @param { DemoUser[] } args.users - array of demo users
 * @param { DemoUser } args.issuer - issuer of the token
 * @param { StellarPlus.Asset.SorobanTokenHandler } args.token - Soroban Token Handler for the token to mint to the users
 * @param { string } args.mintAmount - amount to mint to users
 *
 * @returns  { Promise<void> } - void
 *
 * @description Mints tokens to users.
 *
 * */
export const mintSorobanTokensToUsers = async (
  args: MintSorobanTokensToUsers
) => {
  const { users, issuer, token, mintAmount } = args;
  console.log(
    `Minting ${await token.symbol(issuer.transactionInvocation)} tokens to ${users.length
    } users...`
  );
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(
      `${i + 1}/${users.length
      } - Minting ${mintAmount} tokens to user: ${user.account.getPublicKey()}`
    );
    await token.mint({
      ...issuer.transactionInvocation,
      amount: mintAmount,
      to: user.account.getPublicKey(),
    });
  }
};

// ======================================================

export const getRandomEntryFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomAmount = (
  min: number,
  max: number,
  decimals?: number
): string => {
  const amount = Math.floor(Math.random() * (max - min) + min);
  return decimals
    ? (BigInt(amount) * BigInt(10 ** decimals)).toString()
    : amount.toString();
};
