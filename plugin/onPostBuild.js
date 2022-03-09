"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onPostBuild = async (args) => {
  const { cache, reporter } = args;
  const lastFetched = await cache.get("timestamp");
  reporter.info(`Setting timestamp in cache, ${lastFetched}`);
};
exports.default = onPostBuild;
