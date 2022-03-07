import { createRemoteFileNode } from "gatsby-source-filesystem";
import { CreateResolversArgs } from "gatsby";
import { getExtension } from "./getExtension";

export const fileProcessor = async (
  source: { type: string; url: string },
  args: CreateResolversArgs
) => {
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
      fileNode = await createRemoteFileNode({
        url: source.url,
        store,
        cache,
        createNode,
        createNodeId,
        reporter,
        ext: getExtension(source.type),
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
