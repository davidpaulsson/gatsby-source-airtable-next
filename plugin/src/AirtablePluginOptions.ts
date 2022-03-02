export type AirtablePluginOptions = {
  apiKey: string;
  tables: {
    baseId: string;
    tableName: string;
    tableView?: string;
    tableLinks?: string[];
  }[];
  downloadLocal?: string[];
};
