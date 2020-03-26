import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LandingPage } from '../pages/landingPage';
import { ClassroomPage } from '../pages/classromPage';
import { CreateClassPage } from "../pages/createClassPage"
import MenuNavigation from '../components/MenuNavigation';


export const Routes = () => {
  return (
    <Router >
      <MenuNavigation />
      <Switch>
        <Route path={["/", "/landing", "/home"]} exact component={LandingPage} />
        <Route path="/new" exact component={CreateClassPage} />
        <Route path="/:class_id" component={ClassroomPage} />
      </Switch>
    </Router>
  );
};
