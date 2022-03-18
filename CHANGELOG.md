# [3.0.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v2.1.0...v3.0.0) (2022-03-09)

### Code Refactoring

- node creation ([0c8aa23](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/0c8aa231198c99bddd819f9eaf0a29e5211505f9))

### BREAKING CHANGES

- - The `recordLinks` option has changed to `recordLinks?: { fromField: string; toTable: string; }[];`.

* The `downloadLocal` option has been moved into each table.
* Data isn't sourced into a single Airtable type anymore, but split into multiple types, like AirtableMyTableName and AirtableMyOtherTableName, etc. This prevents node name clashing.
* Keys are now directly on the node and not nested into `data` anymore.

# [2.1.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v2.0.0...v2.1.0) (2022-03-07)

### Features

- cache downloaded attachment files ([d99a876](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/d99a87669957e4d304576b1918b9a15807154449))

# [2.0.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v1.1.0...v2.0.0) (2022-03-03)

### Code Refactoring

- rename tableLinks to recordLinks ([f646a1a](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/f646a1afac615baad8ad65542fe2bf7363521fd7))

### BREAKING CHANGES

- The `tableLinks` option has been renamed `recordLinks`.

# [1.1.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v1.0.0...v1.1.0) (2022-03-02)

### Features

- source attachments and create demo ([949fdc6](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/949fdc6f3a8dd4bfb02840ae93b836bb6d8e751c))

# 1.0.0 (2022-03-01)

### Features

- create gatsby nodes from airtable ([fb89974](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/fb89974dafbeb29ff7aab12bafa85f95c86087b2))