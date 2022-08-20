require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  trailingSlash: "always",
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-airtable-next",
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        refreshInterval: 300000,
        tables: [
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Furniture",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            recordLinks: [
              {
                fromField: "Designer",
                toTable: "Designers",
              },
            ],
            downloadLocal: ["Images"],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Designers",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            recordLinks: [
              {
                fromField: "Furniture",
                toTable: "Furniture",
              },
            ],
            downloadLocal: ["Photo"],
          },
        ],
      },
    },
  ],
};
