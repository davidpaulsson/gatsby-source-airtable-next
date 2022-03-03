# gatsby-source-airtable-next

Gatsby source plugin for Airtable that is built for modern Gatsby sites

![NPM Version](https://img.shields.io/npm/v/gatsby-source-airtable-next)
![NPM Downloads](https://img.shields.io/npm/dw/gatsby-source-airtable-next)
![NPM License](https://img.shields.io/npm/l/gatsby-source-airtable-next)
[![Twitter](https://img.shields.io/twitter/follow/davidpaulsson.svg?style=social&label=@davidpaulsson)](https://twitter.com/davidpaulsson)

## How to install

`npm install gatsby-source-airtable-next`

or

`yarn add gatsby-source-airtable-next`

## How to use

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-airtable-next",
      options: {
        apiKey: "AIRTABLE_KEY",
        tables: [
          {
            baseId: "AIRTABLE_BASE_ID",
            tableName: "TABLE_NAME",
            tableView: "TABLE_VIEW_NAME", // optional
            tableLinks: ["LINK_TO_ANOTHER_RECORD_FIELDS"], // optional
          },
          // can be multiple tables, even from different bases
        ],
        downloadLocal: ["ATTACHMENT_FIELDS"], // optional
      },
    },
  ],
};
```

### Node key naming

During node creation this plugin will convert your Airtable table field names into camel case strings, using [Lodash](https://lodash.com/)'s `_.camelCase()` method, and use that as the node key.

For example `Phone no. (Cell)` will become `phoneNoCell`, `Country of origin` will become `countryOfOrigin`, and `Package volume (m³)` will become `packageVolumeM`.

### "Link to another Record" type fields

`options: { tables: { tableLinks?: string[] }[] }` _optional_

If set enables links to records in other tables. If you wish to query data from a linked record, you must specify the field name in `tableLinks`. If not set this will be an array of Airtable record IDs.

### Table views

`options: { tables: { tableView?: string }[] }` _optional_

If set, only the records in that view will be returned. The records will be sorted according to the order of the view. Fields hidden in this view will be sourced.

For example, if you are creating a blog or documentation site, specify a published field in Airtable, create a filter showing only published posts, and specify this as the (optional) `tableView` option in your gatsby-config file.

### "Attachment" type fields

`options:{ downloadLocal?: string[] }` _optional_

If set will download the "Attachment" type fields specified in your gatsby-config. This creates a file node (`localFile`) that then can be queried using GraphQL and used with, for example, [`gatsby-image-plugin`](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) if it's an image attachment.

### How does this compare to `gatsby-source-airtable`?

[`gatsby-source-airtable`](https://github.com/jbolda/gatsby-source-airtable) is a great source plugin. I both use this plugin and have gotten a lot of inspiration from it. But it hasn't been updated in quite some time and was originally written for Gatsby v2. A lot has happened with Gatsby since those days.

If you're looking to source data from Airtable, and don't want a wall of `verbose The ___NODE convention is deprecated. Please use the @link directive instead. Migration: https://gatsby.dev/node-convention-deprecation` deprecation warnings in the Gatsby build process logs then this plugin is for you.

## Example

An [example site](https://gatsbysourceairtablenext.gatsbyjs.io/) is available in the [demo folder](https://github.com/davidpaulsson/gatsby-source-airtable-next/tree/main/demo).

This site uses [this Airtable base](https://airtable.com/shryTi3YWlgndB88I) and uses the `tableLinks` option to connect different Airtable tables, and the `downloadLocal` option to download "Attachment" type fields from Airtable for use with [`gatsby-image-plugin`](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/).

## Questions, Feedback, and Suggestions

If you have any questions, feedback or suggestions head on over to [discussions](https://github.com/davidpaulsson/gatsby-source-airtable-next/discussions).

## Found a bug?

If you find a bug please open an [issue](https://github.com/davidpaulsson/gatsby-source-airtable-next/issues) and/or create a pull request to fix it.
