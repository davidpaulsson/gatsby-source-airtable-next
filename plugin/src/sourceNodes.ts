import _ from "lodash";
import Airtable from "airtable";

import { NODE_TYPE } from "./constants";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type { GatsbyNode, PluginOptions, SourceNodesArgs } from "gatsby";
import { pascalCase } from "./utils";

// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
const sourceNodes: GatsbyNode["sourceNodes"] = async (
  args: SourceNodesArgs,
  options: PluginOptions & AirtablePluginOptions
): Promise<void> => {
  const { actions, cache, createNodeId, createContentDigest, reporter } = args;
  const { createNode } = actions;

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

  try {
    const promises = options.tables.map(async (table) => {
      return new Promise<void>((resolve, reject) => {
        const now = new Date();

        const rows: {
          airtableId: string;
          [key: string]: any;
        }[] = [];

        const base = new Airtable({ apiKey: options.apiKey }).base(
          table.baseId
        );

        const viewOptions = table.tableView
          ? { view: table.tableView }
          : undefined;

        base(table.tableName)
          .select(viewOptions)
          .eachPage(
            function page(records, fetchNextPage) {
              // This function (`page`) will get called for each page of records.
              records.forEach(function (record) {
                const fields = _.mapKeys(record.fields, (_v, k) =>
                  _.camelCase(k)
                );
                rows.push({
                  airtableId: record.getId(),
                  ...fields,
                });
              });

              // To fetch the next page of records, call `fetchNextPage`.
              // If there are more records, `page` will get called again.
              // If there are no more records, `done` will get called.
              fetchNextPage();
            },
            async function done(err) {
              if (err) {
                reject(err);
                return;
              }

              const nodeType = pascalCase(`${NODE_TYPE} ${table.tableName}`);

              // Loop through data and create Gatsby nodes
              rows.forEach((row) =>
                createNode({
                  ...row,
                  id: createNodeId(`${nodeType}-${row.airtableId}`),
                  parent: null,
                  children: [],
                  internal: {
                    type: nodeType,
                    content: JSON.stringify(row),
                    contentDigest: createContentDigest(row),
                  },
                })
              );

              await cache.set("timestamp", Date.now());

              const seconds = (Date.now() - now.getTime()) / 1000;
              reporter.info(
                `Airtable: Created ${rows.length} ${pascalCase(
                  `${NODE_TYPE} ${table.tableName}`
                )} nodes - ${seconds}s`
              );

              // Done! 🎉
              resolve();
            }
          );
      });
    });

    await Promise.all(promises);
  } catch (error) {
    console.error(
      "Uh-oh, something went wrong with Airtable node creation.",
      error
    );
  }
};

export default sourceNodes;
