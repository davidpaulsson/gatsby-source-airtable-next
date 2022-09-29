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
import { getExtension, isAttachmentField, pascalCase } from "./utils";
import { createRemoteFileNode } from "gatsby-source-filesystem";

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({
  Joi,
}) => {
  return Joi.object({
    apiKey: Joi.string().required(),
    tables: Joi.array().required(),
    refreshInterval: Joi.number().min(0).default(0),
  });
};

// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  args: SourceNodesArgs,
  options: PluginOptions & AirtablePluginOptions
): Promise<void> => {
  const {
    actions,
    cache,
    createNodeId,
    getNode,
    createContentDigest,
    reporter,
  } = args;
  console.log("Hello from sourceNodes");
  reporter.info("Hello from sourceNodes");
  const { createNode, touchNode } = actions;

  try {
    const rows: {
      airtableId: string;
      [key: string]: any;
    }[] = [];

    const { refreshInterval = 0 } = options;

    const airtableNodeIds: string[] = await cache.get(
      "gatsby-source-airtable-next-nodes-ids"
    );

    const airtableRowsTimestamp = await cache.get(
      "gatsby-source-airtable-next-rows-timestamp"
    );

    const existingNodesAge = Date.now() - airtableRowsTimestamp;

    if (airtableNodeIds && existingNodesAge <= refreshInterval) {
      airtableNodeIds.forEach((id) => {
        const node = getNode(id);
        if (node) {
          touchNode(node);
        }
      });

      reporter.info(`Airtable: using cached nodes`);
    } else {
      const nodesIds: string[] = [];
      const promises = options.tables.map(async (table) => {
        return new Promise<void>((resolve, reject) => {
          const now = new Date();

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
                rows.forEach((row) => {
                  const id = createNodeId(`${nodeType}-${row.airtableId}`);
                  nodesIds.push(id);

                  try {
                    createNode({
                      ...row,
                      id,
                      parent: null,
                      children: [],
                      internal: {
                        type: nodeType,
                        content: JSON.stringify(row),
                        contentDigest: createContentDigest(row),
                      },
                    });
                  } catch (error) {
                    reporter.panic(
                      "Error creating airtable node:",
                      error as Error
                    );
                  }

                  for (const [, value] of Object.entries(row)) {
                    // Attachment fields are always arrays
                    if (_.isArray(value)) {
                      value.forEach(async (obj) => {
                        if (isAttachmentField(obj)) {
                          try {
                            // Create the attachment node
                            const airtableAttachmentNodeId = createNodeId(
                              `airtable-attachment-${obj.airtableId}`
                            );

                            await createNode({
                              id: airtableAttachmentNodeId,
                              airtableId: obj.id,
                              url: obj.url,
                              width: obj.width,
                              height: obj.height,
                              filename: obj.filename,
                              parent: id,
                              placeholderUrl: obj.thumbnails.small.url,
                              mimeType: obj.type,
                              pluginName: "gatsby-source-airtable-next",
                              internal: {
                                type: "AirtableAttachment",
                                content: JSON.stringify(obj),
                                contentDigest: createContentDigest(
                                  obj.airtableId
                                ),
                              },
                            });
                          } catch (error) {
                            reporter.panic(
                              "Error creating airtable attachment file node:",
                              error as Error
                            );
                          }
                        }
                      });
                    }
                  }
                });

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

      await cache.set("gatsby-source-airtable-next-nodes-ids", nodesIds);
      await cache.set(
        "gatsby-source-airtable-next-rows-timestamp",
        `${Date.now()}`
      );
    }
  } catch (error) {
    console.error(
      "Uh-oh, something went wrong with Airtable node creation.",
      error
    );
  }
};

// //www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#onCreateNode
export const onCreateNode: GatsbyNode["onCreateNode"] = async (
  args: CreateNodeArgs
) => {
  console.log("Hello from onCreateNode");
  const { node, actions, createNodeId, getCache } = args;
  const { createNode, createNodeField } = actions;
  if (node.internal.type === "AirtableAttachment" && node.parent !== null) {
    const fileNode = await createRemoteFileNode({
      url: node.url as string,
      parentNodeId: node.parent,
      getCache,
      createNode,
      createNodeId,
      ext: getExtension(node.type as string),
    });

    if (fileNode) {
      createNodeField({
        node,
        name: "localFile",
        value: fileNode.id,
      });
    }
  }
};

// https://www.gatsbyjs.org/docs/node-apis/#createSchemaCustomization
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  (
    args: CreateSchemaCustomizationArgs,
    options: PluginOptions & AirtablePluginOptions
  ) => {
    console.log("Hello from createSchemaCustomization");
    const { actions, schema, store, reporter } = args;

    const strings: string[] = [];
    options.tables.forEach((table) => {
      console.log(`Airtable: Creating schema for ${table.tableName}`);

      const fromType = pascalCase(`${NODE_TYPE} ${table.tableName}`);

      // link records
      if (table.recordLinks) {
        table.recordLinks.forEach((recordLink) => {
          console.log(`Airtable: Creating schema for ${recordLink}`);
          const toType = pascalCase(`${NODE_TYPE} ${recordLink.toTable}`);
          const key = _.camelCase(recordLink.fromField);

          strings.push(`type ${fromType} implements Node {
            ${key}: [${toType}] @link(by: "airtableId")
          }
          type AirtableAttachment implements Node {
            localFile: File @link(from: "fields.localFile")
          }`);
        });
      }

      // link attachments
      if (table.downloadLocal) {
        table.downloadLocal.forEach((field) => {
          console.log(
            `Airtable: Creating AirtableAttachment links for ${field}`
          );
          const key = _.camelCase(field);

          strings.push(`type ${fromType} implements Node {
            ${key}: [AirtableAttachment] @link(by: "airtableId", from: "${key}.id")
          }`);
        });
      }
    });

    console.log({ strings });

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
          store,
        }
      ),
    ]);
  };

// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#onCreateDevServer
export const onCreateDevServer: GatsbyNode["onCreateDevServer"] = (
  args: CreateDevServerArgs
) => {
  const { app } = args;
  polyfillImageServiceDevRoutes(app);
};
