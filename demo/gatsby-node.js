const slugify = require("slugify");

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;

  const { data } = await graphql(`
    query {
      furniture: allAirtable(
        filter: { table: { eq: "Furniture" } }
        sort: { fields: data___name }
      ) {
        nodes {
          id
          data {
            name
          }
        }
      }
      designers: allAirtable(
        filter: { table: { eq: "Designers" } }
        sort: { fields: data___name }
      ) {
        nodes {
          id
          data {
            name
          }
        }
      }
    }
  `);

  data.furniture.nodes.forEach((node) => {
    createPage({
      path: `/furniture/${slugify(node.data.name, { lower: true })}`,
      component: require.resolve("./src/templates/product.tsx"),
      context: {
        id: node.id,
      },
    });
  });

  data.designers.nodes.forEach((node) => {
    createPage({
      path: `/designers/${slugify(node.data.name, { lower: true })}`,
      component: require.resolve("./src/templates/designer.tsx"),
      context: {
        id: node.id,
      },
    });
  });
};
