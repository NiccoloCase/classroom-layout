import * as React from "react";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import MenuNavigation from '../components/MenuNavigation';
import { TitleComponent } from '../components/TitleComponent';
// PAGINE
import { LandingPage } from '../pages/landingPage';
import { ClassroomPage } from '../pages/classromPage';
import { CreateClassPage } from "../pages/createClassPage"
import FooterComponent from '../components/Footer';

/**
 * Funzione che decide se indirizzare il client a una classe salvata o alla landing page 
 */
const SwitchMainPage: React.FC<RouteComponentProps> = ({ history }) => {
  // cotrolla se è stato salvata una classe
  const savedClassId = localStorage.getItem("favorite-classroom-id");
  if (savedClassId) history.push(`/${savedClassId}`);
  // se non è stato salvata una classe inidirizza alla landing page
  else history.push(`/landing`);
  return null;
}

export const Routes = () => {
  return (
    <Router >
      <TitleComponent />
      <MenuNavigation />
      <Switch>
        <Route path={["/", "/home"]} exact component={SwitchMainPage} />
        <Route path="/landing" exact component={LandingPage} />
        <Route path="/new" exact component={CreateClassPage} />
        <Route path="/:class_id" component={ClassroomPage} />
      </Switch>
      <FooterComponent />
    </Router>
  );
};