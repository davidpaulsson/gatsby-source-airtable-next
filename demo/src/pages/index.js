import { useStaticQuery, Link, graphql } from "gatsby";
import slugify from "slugify";
import React from "react";

const IndexPage = () => {
  const { allAirtableFurniture, allAirtableDesigners } = useStaticQuery(graphql`
    {
      allAirtableFurniture(sort: { fields: name }) {
        nodes {
          name
        }
      }
      allAirtableDesigners(sort: { fields: name }) {
        nodes {
          name
        }
      }
    }
  `);

  return (
    <main>
      <h1>Furniture</h1>
      <ul>
        {allAirtableFurniture.nodes.map((node) => (
          <li key={node.name}>
            <Link to={`/furniture/${slugify(node.name, { lower: true })}`}>
              {node.name}
            </Link>
          </li>
        ))}
      </ul>
      <h1>Designers</h1>
      <ul>
        {allAirtableDesigners.nodes.map((node) => (
          <li key={node.name}>
            <Link to={`/designers/${slugify(node.name, { lower: true })}`}>
              {node.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default IndexPage;
