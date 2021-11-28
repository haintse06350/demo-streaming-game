const awsmobile = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION || "us-east-1",
  aws_cognito_identity_pool_id:
    process.env.REACT_APP_AWS_COGNITO_IDENTIY_POOL_ID ||
    "us-east-1:553164e5-bf56-441e-8c24-2e60fadafac1",
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION || "us-east-1",
  aws_user_pools_id:
    process.env.REACT_APP_AWS_USER_POOLS_ID || "us-east-1_EBNwCwIal",
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID ||
    "7v8f9co8n07ln730uff4q8ghmd",
  oauth: {
    domain:
      process.env.REACT_APP_OAUTH_DOMAIN ||
      "onmo-dev.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn:
      process.env.REACT_APP_OAUTH_REDIRECT_SIGNIN ||
      "https://admin-dev.onmostealth.com/",
    redirectSignOut:
      process.env.REACT_APP_OAUTH_REDIRECT_SIGNOUT ||
      "https://admin-dev.onmostealth.com/",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_AND_IDENTITY_POOLS",
  aws_appsync_graphqlEndpoint:
    process.env.REACT_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT ||
    "https://qgt775bmejdcxfkidvudqnzh4y.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: process.env.REACT_APP_AWS_APPSYNC_REGION || "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  aws_cloud_logic_custom: [],
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_STORAGE_BUCKET || "onmo-admin-upload-dev", //REQUIRED -  Amazon S3 bucket name
      region: process.env.REACT_APP_STORAGE_REGION || "us-east-1", //OPTIONAL -  Amazon service region
    },
  },
};

export default awsmobile;
