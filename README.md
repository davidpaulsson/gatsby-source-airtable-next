# gatsby-source-airtable-next

> Gatsby source plugin for Airtable, built for Gatsby v4 and beyond 🚀

![NPM Downloads](https://img.shields.io/npm/dw/gatsby-source-airtable-next)
![NPM License](https://img.shields.io/npm/l/gatsby-source-airtable-next)
[![Twitter](https://img.shields.io/twitter/follow/davidpaulsson.svg?style=social&label=@davidpaulsson)](https://twitter.com/davidpaulsson)

## How to install

`npm install gatsby-source-airtable-next`

or

`yarn add gatsby-source-airtable-next`

## How to use

```
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-airtable-next",
      options: {
        apiKey: "YOUR_AIRTABLE_KEY", // may instead specify via env
        tables: [
          {
            baseId: "YOUR_AIRTABLE_BASE_ID",
            tableName: "YOUR_AIRTABLE_NAME",
            tableView: "YOUR_AIRTABLE_VIEW_NAME", // optional, you can keep sort order and filters from Airtable views. NOTE: hidden fields will still be queried
            tableLinks: ["YOUR_AIRTABLE_LINKS"], // optional, fields that links to other tables. if specified here they will become nested nodes
          },
        ],
        downloadLocal: ["YOUR_AIRTABLE_FIELDS"], // optional, field names for your Airtable attachments fields
      },
    }
  ],
}
```

**NOTE**: `gatsby-source-airtable-next` camelCases all field names. So if you have a field on an Airtable column named "Total units sold", it will be renamed `totalUnitsSold`.

### Example

An [example site](https://gatsbysourceairtablenext.gatsbyjs.io/) is in the [demo folder](https://github.com/davidpaulsson/gatsby-source-airtable-next/tree/main/demo). This site uses [this Airtable base](https://airtable.com/shryTi3YWlgndB88I).

## Questions, Feedback and Suggestions

If you have any questions, feedback or suggestions head on over to [discussions](https://github.com/davidpaulsson/gatsby-source-airtable-next/discussions).

## Found a bug?

If you find a bug please open an [issue](https://github.com/davidpaulsson/gatsby-source-airtable-next/issues) and/or create a pull request to fix it.
