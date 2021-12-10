import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth } from "aws-amplify";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_V2 || "https://api.onmostealth.com/",
  includeExtensions: true,
});

const authLink = setContext(async (_, { headers }) => {
  const currentSession = await Auth.currentSession();
  const accessToken = currentSession.getAccessToken();
  const tokenJwt = accessToken.getJwtToken();

  return {
    headers: {
      ...headers,
      authorization: tokenJwt || "",
    },
  };
});

let client = null;
export const getInstance = () => {
  if (client) return client;

  client = new ApolloClient({
    link: authLink.concat(httpLink),
    uri: process.env.REACT_APP_GRAPHQL_V2 || "https://api.onmostealth.com/",
    cache: new InMemoryCache({}),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
    },
  });

  return client;
};

const apollo = {
  getInstance,
};

export default apollo;
