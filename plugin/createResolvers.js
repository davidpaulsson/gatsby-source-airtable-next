"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileProcessor_1 = require("./fileProcessor");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const createResolvers = (args, options) => {
  if (options.tables.every((table) => !table.downloadLocal)) {
    return;
  }
  const { createResolvers } = args;
  options.tables.forEach((table) => {
    if (!table.downloadLocal) {
      return;
    }
    const nodeType = (0, utils_1.pascalCase)(
      `${constants_1.NODE_TYPE} ${table.tableName}`
    );
    table.downloadLocal.forEach((field) => {
      createResolvers({
        [(0, utils_1.pascalCase)(`${nodeType} ${field}`)]: {
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
  });
};
exports.default = createResolvers;
