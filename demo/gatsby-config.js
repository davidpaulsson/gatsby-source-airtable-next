require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-airtable-next",
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Families",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            tableLinks: ["Products"],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Products",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            mapping: { Description: "text/markdown" },
            tableLinks: ["Family", "Variants"],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Variants",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            tableLinks: [
              "Product",
              "Primary_material",
              "Secondary_material",
              "Certifications",
            ],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Materials",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
            tableLinks: [
              "Primary_material_for_variant",
              "Secondary_material_for_variant",
              "Consists_of",
              "Certifications",
              "Flame_resistance",
            ],
            mapping: { Image: "fileNode" },
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Certifications",
            tableView: process.env.AIRTABLE_TABLE_VIEW,
          },
        ],
      },
    },
  ],
};
