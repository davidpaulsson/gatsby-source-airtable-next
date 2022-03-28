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

export type AirtableAttachment = {
  id: string;
  height: number;
  width: number;
  url: string;
  type: string;
  thumbnails: {
    small: {
      url: string;
    };
  };
};
