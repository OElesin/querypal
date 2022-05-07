# Querypal

Querypal is a web-based, query execution tool which leverages Amazon Athena to make authoring queries and retrieving results simple for users. 
Querypal provides the ability to find tables, see metadata, browse sample rows, write and edit queries, then submit queries all in a web interface. 
Once queries are running, users can track query progress and when finished, get the results back through the browser as a table.

- [Features](#features)
- [Requirements](#requirements)
- [Project setup](#project-setup)

![Querypal UI](images/querypal-video-demo.gif)

### Features  
- Fully serverless and can be hosted as an Amazon S3 static website.
- Authentication is managed by Amazon Cognito and can be customized.
- Table explorer to visualize schema of table and first 1000 rows.
- Syntax highlighting
- Global Query Timeline: The query timeline allows users to share queries with their colleagues. Shared queries 
are visible to all users and can help speed up analysis. 


### TODOs
- [x] Saved queries
- [x] Query history for self
- [ ] Result export to CSV
- [ ] Auto-suggestions
- [ ] Remove dependency on AWS SSM Parameter store for GitHub Access Token

### Requirements:
- AWS Account
- NPM or Node
- VueJS
- AWS Amplify
- Yarn package manager
- See project setup below


## Deployment
To deploy the infrastructure and code, you'll need an AWS account and a correctly [configured AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) with enough 
permissions to create the architecture below (Administrator rights are recommended).
```shell script
bash ./deploy.sh -p <aws_profile> -r <aws_region> -t <GitHubToken>
```

### Shell Script Parameters

| Parameter | Description                                       | Mandatory |
|-----------|---------------------------------------------------|-----------|
| n         | CloudFormation stack name                         | No        |
| p         | AWS CLI Profile                                   | No        |
| r         | AWS CLI Region                                    | No        |
| e         | GitHub Branch to deploy QueryPal from             | No        |
| t         | GitHub Token in plain text. AWS Amplify needs this to access to repository | Yes       |
| a         | AWS Amplify App name, i.e. querypal               | No        |

Before executing the shell command above, you MUST provide a [GitHub Access token](https://github.com/settings/tokens)
that will be used to create a webhook and read-only deploy key by AWS Amplify. See screenshot with permissions required
below: 
![GitHub Token Permissions](github-token-permissions.png)

All arguments to the `deploy.sh` script are optional. The default AWS profile and region are used if none are provided.

The script will:
1. Create a CloudFormation stack named `querypal-web-ui` holding the following: 
    - AWS Amplify App for Querypal
    - IAM Service to be assumed by AWS Amplify for managing deployments
    - SSM Parameter containing the AWS Amplify App ID which will be used later
2. Deploy an AWS Amplify UI and monitor the job
3. Print out Querypal AWS Amplify Default Domain URL.

The initial deployment can take 10-15 minutes. The same command can be used for both creating and updating infrastructure.  

## Development
### Project setup
```shell script
yarn install
```

### Compiles and hot-reloads for development
```shell script
yarn run serve
```

### Compiles and minifies for production
```shell script
yarn run build
```

### Run your tests
```shell script
yarn run test
```

### Lints and fixes files
```shell script
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
