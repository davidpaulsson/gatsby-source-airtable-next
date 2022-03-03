import _ from "lodash";
import Airtable from "airtable";

import { NODE_TYPE } from "./constants";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type { GatsbyNode, PluginOptions, SourceNodesArgs } from "gatsby";
import { isAirtableRecordId } from "./utils";

// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
const sourceNodes: GatsbyNode["sourceNodes"] = async (
  args: SourceNodesArgs,
  options: PluginOptions & AirtablePluginOptions
): Promise<void> => {
  const { actions, createNodeId, createContentDigest, reporter } = args;
  const { createNode, createTypes } = actions;

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

        const data: {
          airtableId: string;
          table: string;
          data: { [key: string]: any };
        }[] = [];

        const base = new Airtable({ apiKey: options.apiKey }).base(
          table.baseId
        );

        const viewOptions = table.tableView
          ? {
              view: table.tableView,
            }
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
                data.push({
                  airtableId: record.getId(),
                  table: table.tableName,
                  data: fields,
                });
              });

              // To fetch the next page of records, call `fetchNextPage`.
              // If there are more records, `page` will get called again.
              // If there are no more records, `done` will get called.
              fetchNextPage();
            },
            function done(err) {
              if (err) {
                reject(err);
                return;
              }

              // Loop through data and create Gatsby nodes
              data.forEach((entry) => {
                createNode({
                  ...entry,
                  id: createNodeId(`${NODE_TYPE}-${entry.airtableId}`),
                  parent: null,
                  children: [],
                  internal: {
                    type: NODE_TYPE,
                    content: JSON.stringify(entry),
                    contentDigest: createContentDigest(entry),
                  },
                });

                for (const [key, value] of Object.entries(entry.data)) {
                  if (
                    // record links are always an array
                    Array.isArray(value) &&
                    // ensure the whole array is airtable ids
                    value.every((val) => isAirtableRecordId.test(val))
                  ) {
                    createTypes(`type AirtableData implements Node {
                      ${key}: [Airtable] @link(by: "airtableId", from: "${key}")
                    }`);
                  }
                }
              });

              const seconds = (Date.now() - now.getTime()) / 1000;
              reporter.success(
                `Created ${data.length} nodes from Airtable table ${table.tableName} - ${seconds}s`
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

  // get the last timestamp from the cache
  // const lastFetched = await cache.get(`timestamp`);
};

export default sourceNodes;
