export type AirtablePluginOptions = {
  apiKey: string;
  tables: {
    baseId: string;
    tableName: string;
    tableView?: string;
    recordLinks?: string[];
  }[];
  downloadLocal?: string[];
};
