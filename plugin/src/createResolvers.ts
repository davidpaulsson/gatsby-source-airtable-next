import _ from "lodash";

import type { AirtablePluginOptions } from "./AirtablePluginOptions";
import type { CreateResolversArgs, GatsbyNode, PluginOptions } from "gatsby";
import { fileProcessor } from "./fileProcessor";

const createResolvers: GatsbyNode["createResolvers"] = (
  args: CreateResolversArgs,
  options: PluginOptions & AirtablePluginOptions
) => {
  if (!_.isArray(options.downloadLocal) || options.downloadLocal.length === 0) {
    return;
  }

  const { createResolvers, reporter } = args;

  const now = new Date();

  options.downloadLocal.forEach((field) => {
    createResolvers({
      [_.startCase(_.camelCase(`AirtableData ${field}`)).replace(/ /g, "")]: {
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

  const seconds = (Date.now() - now.getTime()) / 1000;
  reporter.success(`Creating Airtable attachment resolvers - ${seconds}s`);
};

export default createResolvers;
