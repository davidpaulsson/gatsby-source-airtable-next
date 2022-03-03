"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResolvers = exports.sourceNodes = void 0;
var sourceNodes_1 = require("./sourceNodes");
Object.defineProperty(exports, "sourceNodes", {
  enumerable: true,
  get: function () {
    return __importDefault(sourceNodes_1).default;
  },
});
// export { default as createSchemaCustomization } from "./createSchemaCustomization";
var createResolvers_1 = require("./createResolvers");
Object.defineProperty(exports, "createResolvers", {
  enumerable: true,
  get: function () {
    return __importDefault(createResolvers_1).default;
  },
});
