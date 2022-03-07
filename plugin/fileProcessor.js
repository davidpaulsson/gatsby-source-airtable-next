"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileProcessor = void 0;
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const getExtension_1 = require("./getExtension");
const fileProcessor = async (source, args) => {
  const { cache, getNode, actions, store, createNodeId, reporter } = args;
  const { touchNode, createNode } = actions;
  let fileNode;
  // If we have cached data, return the file
  const mediaDataCacheKey = `airtable-attachment-${source.url}`;
  const cacheMediaData = await cache.get(mediaDataCacheKey);
  if (cacheMediaData) {
    fileNode = getNode(cacheMediaData.cacheId);
    if (fileNode) {
      // Touch the file node so to tell Gatsby that it's still valid
      touchNode(fileNode);
      return fileNode;
    }
  }
  // If we don't have cached data, download the file
  if (!fileNode) {
    try {
      fileNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
        url: source.url,
        store,
        cache,
        createNode,
        createNodeId,
        reporter,
        ext: (0, getExtension_1.getExtension)(source.type),
      });
      if (fileNode) {
        await cache.set(mediaDataCacheKey, { cacheId: fileNode.id });
        return fileNode;
      }
    } catch (e) {
      reporter.warn(`Could not download attachment ${source.url}`);
      return null;
    }
  }
  return null;
};
exports.fileProcessor = fileProcessor;
