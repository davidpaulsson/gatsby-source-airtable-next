const slugify = require("slugify");

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;

  const { data } = await graphql(`
    query {
      allAirtableFurniture(sort: { fields: name }) {
        nodes {
          id
          name
        }
      }
      allAirtableDesigners(sort: { fields: name }) {
        nodes {
          id
          name
        }
      }
    }
  `);

  data.allAirtableFurniture.nodes.forEach((node) => {
    createPage({
      path: `/furniture/${slugify(node.name, { lower: true })}`,
      component: require.resolve("./src/templates/product.tsx"),
      context: {
        id: node.id,
      },
    });
  });

  data.allAirtableDesigners.nodes.forEach((node) => {
    createPage({
      path: `/designers/${slugify(node.name, { lower: true })}`,
      component: require.resolve("./src/templates/designer.tsx"),
      context: {
        id: node.id,
      },
    });
  });
};
