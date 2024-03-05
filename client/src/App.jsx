import { Outlet } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import Nav from "./components/Nav";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client/";
import { setContext } from "@apollo/client/link/context";
import { configureStore } from "@reduxjs/toolkit";
import rootReduce from "./reducers";
const store = configureStore({
  reducer: rootReduce,
});

// create main GraphicQL Qpi endpoint
const httpLink = createHttpLink({ uri: "/graphql" });
// add the auth token to each request if it exists on the window object
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: { ...headers, authorization: `Bearer ${token}` }, //return updated header
  };
});
//create client with authentication and Http link
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Nav />
        <Outlet />
      </Provider>
    </ApolloProvider>
  );
}
export default App;
