export const hexStringToBytes32 = (hexString: string): Buffer => {
  if (hexString.length !== 64) {
    throw new Error(
      "Hex string must be 64 characters long to be a valid bytes32"
    );
  }
  return Buffer.from(hexString, "hex");
};
