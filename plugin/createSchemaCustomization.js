"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const createSchemaCustomization = (args, options) => {
  const { actions, reporter } = args;
  const { createTypes } = actions;
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
  const strings = [];
  options.tables.forEach((table) => {
    table.recordLinks?.forEach((recordLink) => {
      const fromType = (0, utils_1.pascalCase)(
        `${constants_1.NODE_TYPE} ${table.tableName}`
      );
      const toType = (0, utils_1.pascalCase)(
        `${constants_1.NODE_TYPE} ${recordLink.toTable}`
      );
      const key = lodash_1.default.camelCase(recordLink.fromField);
      strings.push(`type ${fromType} implements Node {
        ${key}: [${toType}] @link(by: "airtableId")
      }`);
    });
  });
  const typeDefs = strings.join(`
`);
  createTypes(typeDefs);
};
exports.default = createSchemaCustomization;
