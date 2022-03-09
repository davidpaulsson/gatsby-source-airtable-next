export type AirtablePluginOptions = {
  apiKey: string;
  tables: {
    baseId: string;
    tableName: string;
    tableView?: string;
    recordLinks?: {
      fromField: string;
      toTable: string;
    }[];
    downloadLocal?: string[];
  }[];
};
