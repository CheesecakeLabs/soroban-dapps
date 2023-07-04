import styles from "./styles.module.scss";
import { useContractValue } from "@soroban-react/contracts";
import { useSorobanReact } from "@soroban-react/core";
import { WalletData } from "@soroban-react/wallet-data";
import { Constants } from "shared/constants";
import { scvalToSymbol } from "shared/convert";
import * as SorobanClient from "soroban-client";

const Home = (): JSX.Element => {
  const sourceSecretKey = process.env.REACT_APP_SECRET_KEY || "";
  const sourceKeypair = SorobanClient.Keypair.fromSecret(sourceSecretKey);
  const sourcePublicKey = sourceKeypair.publicKey();

  const { address, activeChain } = useSorobanReact();
  const sorobanContext = useSorobanReact();

  const response = useContractValue({
    contractId: Constants.ContractId,
    method: "hello",
    sorobanContext,
  });

  console.log(response);

  const result = response.result?.vec();
  if (result) console.log(scvalToSymbol(result[0]));

  return (
    <main>
      <header className={styles.header}>
        <p>Public Key: {sourcePublicKey}</p>
        <p>Secret Key: {sourceSecretKey}</p>
        <p>Address: {address}</p>
        <p>Network: {activeChain?.networkPassphrase}</p>

        <WalletData sorobanContext={useSorobanReact()} />

        <p>Result: {result ? scvalToSymbol(result[0]) : ""}</p>
      </header>
    </main>
  );
};

export default Home;
