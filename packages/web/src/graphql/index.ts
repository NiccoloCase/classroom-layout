import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import config from "@crl/config";

const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: `/api/graphql` });

export const client = new ApolloClient({
    connectToDevTools: !config.isProduction,
    link: ApolloLink.from([httpLink]),
    cache
});