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
