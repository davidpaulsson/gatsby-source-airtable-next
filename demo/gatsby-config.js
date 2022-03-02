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
        tables: [
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Furniture",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            tableLinks: ["Designer"],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Designers",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            tableLinks: ["Furniture"],
          },
        ],
        downloadLocal: ["Images", "Photo"],
      },
    },
  ],
};
