"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const createSchemaCustomization = (args, options) => {
  const now = new Date();
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
    table.tableLinks?.forEach((link) => {
      const cc = lodash_1.default.camelCase(link);
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
exports.default = createSchemaCustomization;
