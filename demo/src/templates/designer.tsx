import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import slugify from "slugify";

const DesignerPage = ({ data: { designer } }) => {
  return (
    <div>
      <h1>{designer.name}</h1>
      <p>{designer.bio}</p>
      <GatsbyImage image={designer.photo[0].gatsbyImage} alt={designer.name} />
      <h2>Furniture by {designer.name}</h2>
      <ul>
        {designer.furniture.map(({ name, images }) => (
          <li key={name}>
            <Link to={`/furniture/${slugify(name, { lower: true })}/`}>
              {name}

              <br />
              <GatsbyImage image={images[0].gatsbyImage} alt={name} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const query = graphql`
  query DesignerPage($id: String!) {
    designer: airtableDesigners(id: { eq: $id }) {
      name
      bio
      photo {
        gatsbyImage(width: 500, aspectRatio: 1.5)
      }
      furniture {
        name
        images {
          gatsbyImage(height: 200, width: 200)
        }
      }
    }
  }
`;

export default DesignerPage;
