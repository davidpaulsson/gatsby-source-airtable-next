import Airtable from "airtable";
import {
  GatsbyNode,
  SourceNodesArgs,
  PluginOptions,
  CreateSchemaCustomizationArgs,
  CreateNodeArgs,
  CreateDevServerArgs,
} from "gatsby";
import {
  addRemoteFilePolyfillInterface,
  polyfillImageServiceDevRoutes,
} from "gatsby-plugin-utils/polyfill-remote-file";
import _ from "lodash";
import { NODE_TYPE } from "./constants";
import { AirtablePluginOptions } from "./types";
import { isAttachmentField, pascalCase } from "./utils";

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({
  Joi,
}) => {
  return Joi.object({
    apiKey: Joi.string().required(),
    tables: Joi.array().required(),
  });
};

// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  args: SourceNodesArgs,
  options: PluginOptions & AirtablePluginOptions
): Promise<void> => {
  const { actions, cache, createNodeId, createContentDigest, reporter } = args;
  const { createNode } = actions;

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

//www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#onCreateNode
export const onCreateNode: GatsbyNode["onCreateNode"] = async (
  args: CreateNodeArgs,
  options: PluginOptions & AirtablePluginOptions
) => {
  const { node, actions, createNodeId } = args;
  const { createNode } = actions;

  const nodeTypes = options.tables.map((table) =>
    pascalCase(`${NODE_TYPE} ${table.tableName}`)
  );

  if (nodeTypes.includes(node.internal.type)) {
    // Find any attachement fields
    for (const [, value] of Object.entries(node)) {
      // Attachment fields are always arrays
      if (Array.isArray(value)) {
        value.forEach(async (obj) => {
          if (isAttachmentField(obj)) {
            // This is an attachment 🎉
            const airtableAttachmentNode = {
              id: createNodeId(`airtable-attachment-${obj.id}`),
              airtableId: obj.id,
              url: obj.url,
              width: obj.width,
              height: obj.height,
              filename: obj.filename,
              parent: node.id,
              placeholderUrl: obj.thumbnails.small.url,
              mimeType: obj.type,
              pluginName: "gatsby-source-airtable-next",
              internal: {
                type: "AirtableAttachment",
                contentDigest: node.internal.contentDigest,
              },
            };

            createNode(airtableAttachmentNode);
          }
        });
      }
    }
  }
};

// https://www.gatsbyjs.org/docs/node-apis/#createSchemaCustomization
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  (
    args: CreateSchemaCustomizationArgs,
    options: PluginOptions & AirtablePluginOptions
  ) => {
    const { actions, reporter, schema } = args;

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
      const fromType = pascalCase(`${NODE_TYPE} ${table.tableName}`);

      // link records
      table.recordLinks?.forEach((recordLink) => {
        const toType = pascalCase(`${NODE_TYPE} ${recordLink.toTable}`);
        const key = _.camelCase(recordLink.fromField);

        strings.push(`type ${fromType} implements Node {
          ${key}: [${toType}] @link(by: "airtableId")
        }`);
      });

      // link attachments
      if (
        Array.isArray(table.downloadLocal) &&
        table.downloadLocal.length > 0
      ) {
        table.downloadLocal.forEach((field) => {
          const key = _.camelCase(field);

          strings.push(`type ${fromType} implements Node {
            ${key}: [AirtableAttachment] @link(by: "airtableId", from: "${key}.id")
          }`);
        });
      }
    });

    const typeDefs = strings.join(`
`);

    actions.createTypes(typeDefs);

    actions.createTypes([
      addRemoteFilePolyfillInterface(
        schema.buildObjectType({
          name: "AirtableAttachment",
          fields: {
            airtableId: "String!",
          },
          interfaces: ["Node", "RemoteFile"],
        }),
        {
          schema,
          actions,
        }
      ),
    ]);
  };

export const onCreateDevServer: GatsbyNode["onCreateDevServer"] = (
  args: CreateDevServerArgs
) => {
  const { app } = args;
  polyfillImageServiceDevRoutes(app);
};
