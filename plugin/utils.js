"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtension = exports.isAttachmentField = exports.pascalCase = void 0;
const lodash_1 = __importDefault(require("lodash"));
const pascalCase = (str) =>
  lodash_1.default.startCase(lodash_1.default.camelCase(str)).replace(/ /g, "");
exports.pascalCase = pascalCase;
const isAttachmentField = (obj) => {
  if (
    obj.id &&
    obj.url &&
    obj.type &&
    obj.width &&
    obj.height &&
    obj.filename &&
    typeof obj.thumbnails === "object" &&
    !Array.isArray(obj.thumbnails) &&
    obj.thumbnails !== null
  ) {
    return true;
  }
  return false;
};
exports.isAttachmentField = isAttachmentField;
const getExtension = (type) => {
  let extention = type.split("/")[1];
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
  return extention;
};
exports.getExtension = getExtension;
