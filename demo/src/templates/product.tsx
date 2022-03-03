import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import slugify from "slugify";

const ProductPage = ({
  data: {
    airtable: { data },
  },
}) => {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      {data.images.map((image) => (
        <GatsbyImage
          key={image.id}
          image={image.localFile.childImageSharp.gatsbyImageData}
          alt={data.name}
        />
      ))}
      <ul>
        <li>Price: $ {data.unitCost.toLocaleString()}</li>

        {data.designer?.[0]?.data?.name !== undefined && (
          <li>
            Designed by{" "}
            <Link
              to={`/designers/${slugify(data.designer[0].data.name, {
                lower: true,
              })}`}
            >
              {data.designer[0].data.name}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export const query = graphql`
  query ProductPage($id: String!) {
    airtable(id: { eq: $id }) {
      data {
        name
        description
        images {
          id
          localFile {
            childImageSharp {
              gatsbyImageData(width: 500, aspectRatio: 1.5)
            }
          }
        }
        unitCost
        designer {
          data {
            name
          }
        }
      }
    }
  }
`;

export default ProductPage;
