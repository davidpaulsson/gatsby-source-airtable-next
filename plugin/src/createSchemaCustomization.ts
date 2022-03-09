import _ from "lodash";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type {
  CreateSchemaCustomizationArgs,
  GatsbyNode,
  PluginOptions,
} from "gatsby";
import { NODE_TYPE } from "./constants";
import { pascalCase } from "./utils";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = (
  args: CreateSchemaCustomizationArgs,
  options: PluginOptions & AirtablePluginOptions
) => {
  const { actions, reporter } = args;
  const { createTypes } = actions;

  try {
    if (options.tables === undefined || options.tables.length === 0) {
      throw "tables is not defined for gatsby-source-airtable-next in gatsby-config.js";
    }
    if (options.apiKey === undefined) {
      throw "apiKey is not defined for gatsby-source-airtable-next in gatsby-config.js";
    }
  } catch (err) {
    reporter.error(`${err}`);
    return;
  }

  const strings: string[] = [];
  options.tables.forEach((table) => {
    table.recordLinks?.forEach((recordLink) => {
      const fromType = pascalCase(`${NODE_TYPE} ${table.tableName}`);
      const toType = pascalCase(`${NODE_TYPE} ${recordLink.toTable}`);
      const key = _.camelCase(recordLink.fromField);

      strings.push(`type ${fromType} implements Node {
        ${key}: [${toType}] @link(by: "airtableId")
      }`);
    });
  });

  const typeDefs = strings.join(`
`);

  createTypes(typeDefs);
};

export default createSchemaCustomization;
