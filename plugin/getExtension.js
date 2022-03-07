"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtension = void 0;
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
