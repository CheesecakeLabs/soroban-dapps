import { readFile } from "fs/promises";

export const loadWasmFile = async (wasmFilePath: string): Promise<Buffer> => {
  try {
    const buffer = await readFile(wasmFilePath);
    return buffer;
  } catch (error) {
    console.log("failed to load file from path: ", wasmFilePath);
    throw error;
  }
};
