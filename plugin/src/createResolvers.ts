import _ from "lodash";

import { createRemoteFileNode } from "gatsby-source-filesystem";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type { CreateResolversArgs, GatsbyNode, PluginOptions } from "gatsby";

const createResolvers: GatsbyNode["createResolvers"] = (
  args: CreateResolversArgs,
  options: PluginOptions & AirtablePluginOptions
) => {
  const { actions, cache, createNodeId, createResolvers, store, reporter } =
    args;
  const { createNode } = actions;
  if (!_.isArray(options.downloadLocal)) {
    return;
  }

  const now = new Date();

  options.downloadLocal.forEach((field) => {
    createResolvers({
      [_.startCase(_.camelCase(`AirtableData ${field}`)).replace(/ /g, "")]: {
        localFile: {
          type: "File",
          resolve(source: { type: string; url: string }) {
            let extention = source.type.split("/")[1];

            switch (extention) {
              case "jpeg":
                extention = ".jpg";
                break;
              case "svg+xml":
                extention = ".svg";
                break;
              default:
                extention = `.${extention}`;
                break;
            }

            return createRemoteFileNode({
              url: source.url,
              store,
              cache,
              createNode,
              createNodeId,
              reporter,
              ext: extention,
            });
          },
        },
      },
    });
  });

  const seconds = (Date.now() - now.getTime()) / 1000;
  reporter.success(`Creating Airtable attachment resolvers - ${seconds}s`);
};

export default createResolvers;
