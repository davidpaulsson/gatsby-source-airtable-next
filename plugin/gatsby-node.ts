import {
  BuildArgs,
  CreateSchemaCustomizationArgs,
  GatsbyNode,
  PluginOptions,
  SourceNodesArgs,
} from "gatsby";
import Airtable from "airtable";
import _ from "lodash";

const NODE_TYPE = "Airtable";

type AirtablePluginOptions = {
  apiKey: string;
  tables: {
    baseId: string;
    tableName: string;
    tableView: string;
    tableLinks: string[];
  }[];
};

// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  args: SourceNodesArgs,
  options: PluginOptions & AirtablePluginOptions
): Promise<void> => {
  const { actions, createNodeId, createContentDigest, reporter } = args;
  const { createNode } = actions;
  const now = new Date();

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

        base(table.tableName)
          .select({
            view: table.tableView,
          })
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
              data.forEach((entry) =>
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
                })
              );

              const seconds = (Date.now() - now.getTime()) / 1000;
              reporter.success(
                `Created ${data.length} nodes from Airtable ${table.tableName} - ${seconds}s`
              );

              // Done! 🎉
              resolve();
            }
          );
      });
    });

    await Promise.all(promises);
    const seconds = (Date.now() - now.getTime()) / 1000;
    reporter.success(`Creating nodes from Airtable tables - ${seconds}s`);
  } catch (error) {
    console.error(
      "Uh-oh, something went wrong with Airtable node creation.",
      error
    );
  }

  // get the last timestamp from the cache
  // const lastFetched = await cache.get(`timestamp`);
};

// https://www.gatsbyjs.org/docs/node-apis/#onPostBuild
export const onPostBuild: GatsbyNode["onPostBuild"] = async (
  args: BuildArgs
): Promise<void> => {
  const { cache } = args;

  // TODO: use this :)
  // set a timestamp at the end of the build
  await cache.set("timestamp", Date.now());
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  (
    args: CreateSchemaCustomizationArgs,
    options: PluginOptions & AirtablePluginOptions
  ) => {
    const now = new Date();
    const { actions, reporter } = args;
    const { createTypes } = actions;

    const strings: string[] = [];
    options.tables.forEach((table) => {
      table.tableLinks?.forEach((link) => {
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
