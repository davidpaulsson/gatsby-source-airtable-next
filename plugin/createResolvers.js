"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const fileProcessor_1 = require("./fileProcessor");
const createResolvers = (args, options) => {
  if (
    !lodash_1.default.isArray(options.downloadLocal) ||
    options.downloadLocal.length === 0
  ) {
    return;
  }
  const { createResolvers, reporter } = args;
  const now = new Date();
  options.downloadLocal.forEach((field) => {
    createResolvers({
      [lodash_1.default
        .startCase(lodash_1.default.camelCase(`AirtableData ${field}`))
        .replace(/ /g, "")]: {
        localFile: {
          type: "File",
          async resolve(source) {
            const attachment = await (0, fileProcessor_1.fileProcessor)(
              source,
              args
            );
            return attachment;
          },
        },
      },
    });
  });
  const seconds = (Date.now() - now.getTime()) / 1000;
  reporter.success(`Creating Airtable attachment resolvers - ${seconds}s`);
};
exports.default = createResolvers;
