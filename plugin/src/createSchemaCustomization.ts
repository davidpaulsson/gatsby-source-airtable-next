import _ from "lodash";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type {
  CreateSchemaCustomizationArgs,
  GatsbyNode,
  PluginOptions,
} from "gatsby";

const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = (
  args: CreateSchemaCustomizationArgs,
  options: PluginOptions & AirtablePluginOptions
) => {
  const now = new Date();
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
    table.recordLinks?.forEach((link) => {
      const cc = _.camelCase(link);
      strings.push(`type AirtableData implements Node {
        ${cc}: [Airtable] @link(by: "airtableId", from: "${cc}")
      }`);
    });
  });

  const typeDefs = strings.join(`
    `);

  createTypes(typeDefs);
  const seconds = (Date.now() - now.getTime()) / 1000;
  reporter.success(`Building Airtable schema - ${seconds}s`);
};

export default createSchemaCustomization;
