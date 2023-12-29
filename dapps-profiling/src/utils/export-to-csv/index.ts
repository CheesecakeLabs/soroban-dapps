import fs from "fs";
import * as path from 'path';
/**
 * Exports an array of objects or a CSV-formatted string to a CSV file.
 *
 * @param {T[] | string} data - The array of objects or CSV string to export.
 * @param {string} filePath - The path to the output CSV file.
 * @param {string[]} columns - An array of column headers for CSV (optional).
 * @throws {Error} Throws an error if the data is invalid or the data array is empty.
 *
 * @example
 * // Example usage with an array of objects:
 * const data: CustomArrayType[] = [...] // Array of objects
 * const columns: string[] = [...] // Array of column headers (optional)
 * exportArrayToCSV(data, 'output.csv', columns);
 *
 * // Example usage with a CSV-formatted string:
 * const csvString: string = "header1,header2\nvalue1,value2\nvalue3,value4";
 * exportArrayToCSV(csvString, 'output.csv');
 */
export const exportArrayToCSV = <T extends object>(
  data: T[] | string,
  filePath: string,
  columns?: string[]
): void => {
  if (!data) {
    throw new Error("Data is invalid or empty.");
  }

  let csvContent: string;

  if (typeof data === "string") {
    // If data is already a CSV string, use it as is
    csvContent = data;
  } else if (Array.isArray(data) && data.length > 0) {
    // If data is an array of objects, convert it to a CSV string
    if (!columns) {
      columns = Object.keys(data[0]) as string[];
    }

    const headerRow = columns.join(",") + "\n";
    const dataRows = data
      .map((item: any) =>
        columns!.map((col) => convertValueToString(item[col])).join(",")
      )
      .join("\n");

    csvContent = `${headerRow}${dataRows}`;
  } else {
    throw new Error("Data is invalid or empty.");
  }

  const directory = path.dirname(filePath);
  // create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(filePath, csvContent, "utf8");
};

function convertValueToString(value: any): string {
  if (value === null || value === undefined) {
    return "";
  } else if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  } else {
    return JSON.stringify(value);
  }
}
