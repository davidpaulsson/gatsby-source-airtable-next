## [4.3.2](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.3.1...v4.3.2) (2022-12-29)

### Bug Fixes

- rebuild source for 4.3.1 ([3b7af05](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/3b7af051610661728a8d094e39624c070680f9da)), closes [/github.com/davidpaulsson/gatsby-source-airtable-next/issues/6#issuecomment-1367318717](https://github.com//github.com/davidpaulsson/gatsby-source-airtable-next/issues/6/issues/issuecomment-1367318717)

## [4.3.1](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.3.0...v4.3.1) (2022-12-29)

### Bug Fixes

- create separate nodes for each table ([a00fd96](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/a00fd9629fc18f812be01a4c9a8dcff6904c37f3))
- create separate nodes for each table [#7](https://github.com/davidpaulsson/gatsby-source-airtable-next/issues/7) ([dc1c5ca](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/dc1c5ca06149ff21401e0df2f3684dd56dfb45c5))

# [4.3.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.2.1...v4.3.0) (2022-09-20)

### Features

- panic on build if createRemoteFileNode fails ([d255cd4](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/d255cd49486759c1fc562c95bd3f8b1c066d6147))

## [4.2.1](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.2.0...v4.2.1) (2022-08-30)

### Bug Fixes

- touch cached attachment nodes ([57cfbf6](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/57cfbf6cbd926d3f7eb571d3d75edb142a4107ec))

# [4.2.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.1.0...v4.2.0) (2022-08-24)

### Features

- add localFile to attachment keys ([2385be4](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/2385be4f481219526d1b8d154667df57f98cf351))

# [4.1.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.0.1...v4.1.0) (2022-08-18)

### Features

- add 'refreshInterval' option ([ac72285](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/ac72285c7727e46d673fbef7dcca4d88493b14b2))

## [4.0.1](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v4.0.0...v4.0.1) (2022-03-28)

### Bug Fixes

- code cleanup ([bb07dc1](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/bb07dc126fa44c6bc1c9acad958b24a6fb100c75))

# [4.0.0](https://github.com/davidpaulsson/gatsby-source-airtable-next/compare/v3.0.0...v4.0.0) (2022-03-28)

### Features

- add gatsby image cdn support ([7d49449](https://github.com/davidpaulsson/gatsby-source-airtable-next/commit/7d49449830bb0275e929a9a02685c7888e6f031e))

### BREAKING CHANGES

- The `localFile` field has been removed. Image queries should now use `image.gatsbyImage` instead of `image.localFile.childImageSharp.gatsbyImageData`.

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
