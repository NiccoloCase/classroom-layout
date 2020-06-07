import * as React from 'react';
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import { ApolloProvider } from "react-apollo";
import { ThemeProvider } from "./context";
import { client } from './graphql';
import { Routes } from "./routes"

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <ThemeProvider>
          <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
              <Routes />
            </ApolloHooksProvider>
          </ApolloProvider>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
