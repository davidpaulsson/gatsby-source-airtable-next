"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const onCreateNode = (args, options) => {
  const { node, actions, store, reporter } = args;
  const { createTypes } = actions;
  if (node.internal.type === constants_1.NODE_TYPE) {
    for (const [key, value] of Object.entries(node.data)) {
      if (
        // record links are always an array
        Array.isArray(value) &&
        // ensure the whole array is airtable ids
        value.every((val) => utils_1.isAirtableRecordId.test(val))
      ) {
        createTypes(`type AirtableData implements Node {
          ${key}: [Airtable] @link(by: "airtableId", from: "${key}")
        }`);
      }
    }
  }
};
exports.default = onCreateNode;
