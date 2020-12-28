# Querypal

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/OElesin/querypal)

Querypal is a web-based, query execution tool which leverages Amazon Athena to make authoring queries and retrieving results simple for users. 
Querypal provides the ability to find tables, see metadata, browse sample rows, write and edit queries, then submit queries all in a web interface. 
Once queries are running, users can track query progress and when finished, get the results back through the browser as a table.

- [Features](#features)
- [Requirements](#requirements)
- [Project setup](#project-setup)

### Features  
- Fully serverless and can be hosted as an Amazon S3 static website.
- Authentication is managed by Amazon Cognito and can be customized.
- Table explorer to visualize schema of table and first 1000 rows.
- Syntax highlighting


### TODOs
- [x] Saved queries
- [x] Query history for self
- [ ] Result export to CSV
- [ ] Auto-suggestions

### Requirements:
- AWS Account
- NPM or Node
- VueJS
- AWS Amplify
- Yarn package manager
- See project setup below

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
