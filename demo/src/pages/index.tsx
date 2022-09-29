import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import _ from "lodash";

import * as styles from "./index.module.css";

const IndexRoute = ({ data }: PageProps<Queries.IndexRouteQuery>) => {
  return (
    <main>
      <h1>Designers</h1>
      <ul className={styles.designers}>
        {data.designers.nodes
          .filter((designer) => !!designer.name)
          .filter((designer) => designer.photo && designer.photo?.length > 0)
          .map((designer) => {
            return (
              <li key={designer.id}>
                <h2>{designer.name}</h2>
                {designer.photo!.map((photo) => {
                  if (!photo) {
                    return null;
                  }
                  return (
                    <div key={photo.id} className={styles.imageWrapper}>
                      <div>
                        <p>
                          <strong>Gatsby Image CDN</strong>
                        </p>

                        <GatsbyImage
                          image={photo.gatsbyImage}
                          alt={designer.name!}
                        />
                      </div>
                      <div>
                        <p>
                          <strong>localFile.childImageSharp</strong>
                        </p>

                        <GatsbyImage
                          image={
                            photo.localFile?.childImageSharp?.gatsbyImageData!
                          }
                          alt={designer.name!}
                        />
                      </div>
                    </div>
                  );
                })}
                <h4>Linked Furniture from another table</h4>
                {designer.furniture?.map((furniture) => {
                  if (!furniture) {
                    return null;
                  }
                  return (
                    <div key={furniture.id}>
                      <h3>{furniture.name}</h3>
                      {furniture.images?.map((photo) => {
                        if (!photo) {
                          return null;
                        }
                        return (
                          <div key={photo.id} className={styles.imageWrapper}>
                            <div>
                              <p>
                                <strong>Gatsby Image CDN</strong>
                              </p>

                              <GatsbyImage
                                image={photo.gatsbyImage as IGatsbyImageData}
                                alt={furniture.name!}
                              />
                            </div>
                            <div>
                              <p>
                                <strong>localFile.childImageSharp</strong>
                              </p>

                              <GatsbyImage
                                image={
                                  photo.localFile!.childImageSharp!
                                    .gatsbyImageData
                                }
                                alt={furniture.name!}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </li>
            );
          })}
      </ul>
      <hr />
      <p>Query Result:</p>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </main>
  );
};

export default IndexRoute;

export const query = graphql`
  query IndexRoute {
    designers: allAirtableDesigners {
      nodes {
        id
        name
        photo {
          id
          gatsbyImage(height: 150, width: 150)
          localFile {
            childImageSharp {
              gatsbyImageData(height: 150, width: 150)
            }
          }
        }
        furniture {
          id
          name
          images {
            id
            gatsbyImage(height: 150, width: 150)
            localFile {
              childImageSharp {
                gatsbyImageData(height: 150, width: 150)
              }
            }
          }
        }
      }
    }
  }
`;
