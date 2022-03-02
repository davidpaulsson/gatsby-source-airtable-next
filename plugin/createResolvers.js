"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const createResolvers = (args, options) => {
  const { actions, cache, createNodeId, createResolvers, store, reporter } =
    args;
  const { createNode } = actions;
  if (!lodash_1.default.isArray(options.downloadLocal)) {
    return;
  }
  const now = new Date();
  options.downloadLocal.forEach((field) => {
    createResolvers({
      [lodash_1.default
        .startCase(lodash_1.default.camelCase(`AirtableData ${field}`))
        .replace(/ /g, "")]: {
        localFile: {
          type: "File",
          resolve(source) {
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
            return (0, gatsby_source_filesystem_1.createRemoteFileNode)({
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
exports.default = createResolvers;
