import * as React from 'react';
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import { ApolloProvider } from "react-apollo";
import { client } from './graphql';
import { Routes } from "./routes"

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <Routes />
          </ApolloHooksProvider>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
