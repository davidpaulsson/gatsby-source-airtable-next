import _ from "lodash";

export const pascalCase = (str: string) =>
  _.startCase(_.camelCase(str)).replace(/ /g, "");

export const isAttachmentField = (obj: { [key: string]: any }) => {
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

export const getExtension = (type: string) => {
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
