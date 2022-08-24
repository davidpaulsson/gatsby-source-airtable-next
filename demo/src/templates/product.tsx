import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import slugify from "slugify";

const ProductPage = ({ data: { product } }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {product.images.map((image) => (
        <GatsbyImage
          key={image.id}
          image={image.gatsbyImage}
          alt={product.name}
        />
      ))}
      <ul>
        <li>Price: $ {product.unitCost.toLocaleString()}</li>

        {product.designer?.[0]?.name !== undefined && (
          <li>
            Designed by{" "}
            <Link
              to={`/designers/${slugify(product.designer[0].name, {
                lower: true,
              })}`}
            >
              {product.designer[0].name}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export const query = graphql`
  query ProductPage($id: String!) {
    product: airtableFurniture(id: { eq: $id }) {
      name
      description
      images {
        id
        gatsbyImage(width: 500, aspectRatio: 1.5)
      }
      unitCost
      designer {
        name
      }
    }
  }
`;

export default ProductPage;
