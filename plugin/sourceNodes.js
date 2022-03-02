"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const airtable_1 = __importDefault(require("airtable"));
const constants_1 = require("./constants");
// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
const sourceNodes = async (args, options) => {
  const { actions, createNodeId, createContentDigest, reporter } = args;
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
      return new Promise((resolve, reject) => {
        const now = new Date();
        const data = [];
        const base = new airtable_1.default({ apiKey: options.apiKey }).base(
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
                const fields = lodash_1.default.mapKeys(
                  record.fields,
                  (_v, k) => lodash_1.default.camelCase(k)
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
              data.forEach((entry) =>
                createNode({
                  ...entry,
                  id: createNodeId(
                    `${constants_1.NODE_TYPE}-${entry.airtableId}`
                  ),
                  parent: null,
                  children: [],
                  internal: {
                    type: constants_1.NODE_TYPE,
                    content: JSON.stringify(entry),
                    contentDigest: createContentDigest(entry),
                  },
                })
              );
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
exports.default = sourceNodes;
