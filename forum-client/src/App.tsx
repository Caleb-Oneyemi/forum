import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import Home from "./components/routes/Home";
import Thread from "./components/routes/thread/Thread";
import UserProfile from "./components/routes/userProfile/UserProfile";
import { ThreadCategoriesType } from './store/categories/Reducer';
import "./App.css";
import useRefreshReduxMe from "./hooks/useRefreshReduxMe";


const GetAllCategories = gql`
  query {
    getAllCategories {
      ... on EntityResult {
        messages
      }

      ... on ThreadCategoryArray {
        categories {
          id
          name
        }
      }
    }
  }
`;


function App() {
  const { data: categoriesData } = useQuery(GetAllCategories);
  const { execMe, updateMe } = useRefreshReduxMe();
  const dispatch = useDispatch();

  useEffect(() => {
    execMe();
  }, [execMe]);

  useEffect(() => {
    updateMe();
  }, [updateMe]);

  useEffect(() => {  
    if (categoriesData?.getAllCategories?.categories) {
      dispatch({
        type: ThreadCategoriesType,
        payload: categoriesData?.getAllCategories?.categories,
      });
    }
  }, [dispatch, categoriesData])

  const renderHome = (props: any) => <Home {...props} />;
  const renderThread = (props: any) => <Thread {...props} />;
  const renderUserProfile = (props: any) => <UserProfile {...props} />;

  return (
    <Switch>
      <Route exact path="/" render={renderHome} />
      <Route path="/categorythreads/:categoryId?" render={renderHome} />
      <Route path="/thread/:id?" render={renderThread} />
      <Route path="/userprofile/:id" render={renderUserProfile} />
    </Switch>
  );
}

export default App;
