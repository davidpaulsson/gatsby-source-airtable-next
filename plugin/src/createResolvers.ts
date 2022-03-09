import _ from "lodash";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type { CreateResolversArgs, GatsbyNode, PluginOptions } from "gatsby";
import { fileProcessor } from "./fileProcessor";
import { NODE_TYPE } from "./constants";
import { pascalCase } from "./utils";

const createResolvers: GatsbyNode["createResolvers"] = (
  args: CreateResolversArgs,
  options: PluginOptions & AirtablePluginOptions
) => {
  if (options.tables.every((table) => !table.downloadLocal)) {
    return;
  }

  const { createResolvers } = args;

  options.tables.forEach((table) => {
    if (!table.downloadLocal) {
      return;
    }

    const nodeType = pascalCase(`${NODE_TYPE} ${table.tableName}`);
    table.downloadLocal.forEach((field) => {
      createResolvers({
        [pascalCase(`${nodeType} ${field}`)]: {
          localFile: {
            type: "File",
            async resolve(source: { type: string; url: string }) {
              const attachment = await fileProcessor(source, args);
              return attachment;
            },
          },
        },
      });
    });
  });
};

export default createResolvers;
