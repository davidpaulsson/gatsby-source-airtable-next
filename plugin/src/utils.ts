import _ from "lodash";

export const pascalCase = (str: string) =>
  _.startCase(_.camelCase(str)).replace(/ /g, "");
