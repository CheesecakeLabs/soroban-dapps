import {
  Options,
  TransactionCosts,
} from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import {
  AggregateType,
  AggregationMethod,
  FilterResource,
  Filters,
  GetLogOptions,
  LogEntry,
  ResourcesList,
} from "./types";

export class Profiler {
  private log: LogEntry[] = [];

  constructor() {}

  private costHandler = (methodName: string, costs: TransactionCosts): void => {
    const entry: LogEntry = {
      methodName,
      costs,
    };
    this.log.push(entry);
  };
  private txTimeHandler?: (methodName: string, elapsedTime: number) => void;

  public getOptionsArgs = (): Options => {
    return {
      debug: true,
      costHandler: this.costHandler,
      txTimeHandler: this.txTimeHandler,
    };
  };

  public getLog = (options?: GetLogOptions): LogEntry[] | string => {
    const filteredLog = options?.filter
      ? this.filterLog(this.log, options.filter)
      : this.log;

    const aggregatedLog = options?.aggregate
      ? this.aggregateLog(filteredLog, options.aggregate)
      : filteredLog;

    if (options?.clear) {
      this.clearLog();
    }

    if (options?.formatOutput) {
      return this.formatAsTable(aggregatedLog);
    }

    return aggregatedLog;
  };

  public clearLog = (): void => {
    this.log = [];
  };

  // apply filters to log and return filtered log
  // filter by methods, resources and values
  private filterLog = (log: LogEntry[], filters: Filters): LogEntry[] => {
    const { methods, ...resources } = filters;

    const filteredLogByMethods = methods
      ? this.filterLogByMethods(log, methods)
      : log;

    const filteredLogByResources = resources
      ? this.filterLogByResources(filteredLogByMethods, resources)
      : filteredLogByMethods;

    return filteredLogByResources;
  };

  private filterLogByMethods = (
    log: LogEntry[],
    methods: string[]
  ): LogEntry[] => {
    return log.filter((entry) => methods.includes(entry.methodName));
  };

  // filter if resource value is between min and max and include is true
  private filterLogByResources = (
    log: LogEntry[],
    resources: ResourcesList<FilterResource>
  ): LogEntry[] => {
    return log.filter((logEntry) => {
      return Object.keys(resources).every((resourceKey) => {
        const resourceFilter = resources[resourceKey as keyof typeof resources];
        const resourceValue =
          logEntry.costs[resourceKey as keyof TransactionCosts];

        // Skip if the resourceValue or resourceFilter is not defined
        if (!resourceFilter || typeof resourceValue !== "number") {
          return true; // If the resource is not specified in the log, there is no filter to be applied for this resource and we include the log entry
        }
        const includeEntry = resourceFilter.include !== false; // Defaults to true if not explicitly set to false
        // Check if the value is within the optional range
        const isInRange =
          (resourceFilter.min === undefined ||
            resourceValue >= resourceFilter.min) &&
          (resourceFilter.max === undefined ||
            resourceValue <= resourceFilter.max);

        return includeEntry && isInRange;
      });
    });
  };

  private aggregateLog = (
    log: LogEntry[],
    aggregateOptions: AggregateType
  ): LogEntry[] => {
    let costs: [keyof TransactionCosts, number][] = [];

    const resources = Object.keys(log[0]?.costs || {});

    resources.forEach((resourceKey) => {
      const specificMethod =
        aggregateOptions[resourceKey as keyof AggregateType];
      const defaultMethod = aggregateOptions.all;
      const aggregationMethod = specificMethod || defaultMethod;

      if (aggregationMethod) {
        const aggregatedValue = this.performAggregation(
          log,
          resourceKey,
          aggregationMethod
        );

        costs.push([resourceKey as keyof TransactionCosts, aggregatedValue]);
      }
    });

    return [
      {
        methodName: "aggregated",
        costs: Object.fromEntries(costs) as TransactionCosts,
      },
    ] as LogEntry[];
  };

  private performAggregation = (
    logEntries: LogEntry[],
    resourceKey: string,
    aggregationMethod: AggregationMethod
  ): number => {
    const values = logEntries.map((entry) => {
      const value = entry.costs[resourceKey as keyof TransactionCosts];
      return typeof value === "number" ? value : 0; // Ensuring the value is a number
    });

    switch (aggregationMethod.method) {
      case "sum":
        return values.reduce((acc, value) => acc + value, 0);
      case "average":
        const total = values.reduce((acc, value) => acc + value, 0);
        return total / values.length;
      case "standardDeviation":
        const mean =
          values.reduce((acc, value) => acc + value, 0) / values.length;
        const squaredDifferences = values.map((value) => (value - mean) ** 2);
        const variance =
          squaredDifferences.reduce((acc, value) => acc + value, 0) /
          values.length;
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation;
      // Implement other aggregation methods like median, etc.
      default:
        throw new Error(
          `Unknown aggregation method: ${aggregationMethod.method}`
        );
    }
  };

  private formatAsTable(log: LogEntry[]): string {
    if (log.length === 0) {
      return ""; // Return an empty string if the log is empty
    }

    // Determine the column widths
    const columnWidths: number[] = [];
    const headers = ["Method Name", ...Object.keys(log[0]?.costs || {})];

    headers.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...log.map((entry) =>
          Math.max(
            entry.methodName.length,
            (entry.costs[header as keyof TransactionCosts]?.toString() || "")
              .length
          )
        )
      );
      columnWidths[index] = maxLength;
    });

    // Generate the table header
    const headerRow = headers
      .map((header, index) => header.padEnd(columnWidths[index]))
      .join(" | ");

    // Generate the separator row
    const separatorRow = columnWidths
      .map((width) => "-".repeat(width))
      .join("-+-");

    // Generate the data rows
    const dataRows = log
      .map((entry) => {
        const row = [
          entry.methodName,
          ...headers
            .slice(1)
            .map((header) =>
              (entry.costs[header as keyof TransactionCosts] || "")
                .toString()
                .padEnd(columnWidths[headers.indexOf(header) + 1])
            ),
        ];
        return row.join(" | ");
      })
      .join("\n");

    // Combine the header, separator, and data rows
    const formattedTable = [headerRow, separatorRow, dataRows].join("\n");

    return formattedTable;
  }
}
