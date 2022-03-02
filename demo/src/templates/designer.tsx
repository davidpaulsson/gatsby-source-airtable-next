import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import slugify from "slugify";

const DesignerPage = ({
  data: {
    airtable: { data },
  },
}) => {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
      <GatsbyImage
        image={data.photo[0].localFile.childImageSharp.gatsbyImageData}
        alt={data.name}
      />
      <h2>Furniture by {data.name}</h2>
      <ul>
        {data.furniture.map(({ data: { name, images } }) => (
          <li key={name}>
            <Link to={`/furniture/${slugify(name, { lower: true })}/`}>
              {name}

              <br />
              <GatsbyImage
                image={images[0].localFile.childImageSharp.gatsbyImageData}
                alt={name}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const query = graphql`
  query DesignerPage($id: String!) {
    airtable(id: { eq: $id }) {
      data {
        name
        bio
        photo {
          localFile {
            childImageSharp {
              gatsbyImageData(width: 500, aspectRatio: 1.5)
            }
          }
        }
        furniture {
          data {
            name
            images {
              localFile {
                childImageSharp {
                  gatsbyImageData(height: 200, width: 200)
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default DesignerPage;
