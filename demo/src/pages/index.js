import { useStaticQuery, Link, graphql } from "gatsby";
import slugify from "slugify";
import React from "react";

const IndexPage = () => {
  const { furniture, designers } = useStaticQuery(graphql`
    {
      furniture: allAirtable(
        filter: { table: { eq: "Furniture" } }
        sort: { fields: data___name }
      ) {
        nodes {
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
          data {
            name
          }
        }
      }
    }
  `);

  return (
    <main>
      <h1>Furniture</h1>
      <ul>
        {furniture.nodes.map((node) => (
          <li key={node.data.name}>
            <Link to={`/furniture/${slugify(node.data.name, { lower: true })}`}>
              {node.data.name}
            </Link>
          </li>
        ))}
      </ul>
      <h1>Designers</h1>
      <ul>
        {designers.nodes.map((node) => (
          <li key={node.data.name}>
            <Link to={`/designers/${slugify(node.data.name, { lower: true })}`}>
              {node.data.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default IndexPage;
