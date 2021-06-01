import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import configureStore from "./store/configureStore";
import ErrorBoundary from "./components/ErrorBoundary";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  credentials: "include",
  cache: new InMemoryCache({
    resultCaching: false
  })
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore()}>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <ErrorBoundary>{[<App key="App" />]}</ErrorBoundary>
        </ApolloProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
