const awsmobile = {
  aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION || "us-east-1",
  aws_cognito_identity_pool_id:
    process.env.REACT_APP_AWS_COGNITO_IDENTIY_POOL_ID ||
    "ap-south-1:e908c755-ef19-45df-8f0d-dfce4be9b08a",
  aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION || "us-east-1",
  aws_user_pools_id:
    process.env.REACT_APP_AWS_USER_POOLS_ID || "ap-south-1_S0fa0FGML",
  aws_user_pools_web_client_id:
    process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID ||
    "hekgc545d24p1fvcgih8aotnj",
  oauth: {
    domain:
      process.env.REACT_APP_OAUTH_DOMAIN ||
      "onmo-prodindia.auth.ap-south-1.amazoncognito.com",
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
    "https://fvzqqnwjbrdmlktmb7z33vc6xa.appsync-api.ap-south-1.amazonaws.com/graphql",
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
