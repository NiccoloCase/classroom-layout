import * as React from 'react';
import { ApolloProvider } from "@apollo/react-hooks"
import { Routes } from "./routes"
import { client } from './graphql';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <ApolloProvider client={client} >
          <Routes />
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
