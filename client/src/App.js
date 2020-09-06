import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AppNavbar from "./components/navbar.component";
import UserRegister from "./components/user/register.component";
import UserLogin from "./components/user/login.component";
import Documentation from "./components/documentation.component";
import About from "./components/about.component";
import Auth from "./components/auth.component";

import MeasurementsList from "./components/measurements/list.component";
import MeasurementCreate from "./components/measurements/create.component";
import Measurement from "./components/measurements/detail.component";

import NotFound from "./components/notfound.component";


import { AuthProvider } from './Context';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        
        <AppNavbar />

        <Switch>
          <Route path="/measurements" exact component={MeasurementsList} />
          <Route path="/measurements/new" exact component={MeasurementCreate} />
          <Route path="/measurement/:id" exact component={Measurement} />

          <Route path="/docs" exact component={Documentation} />
          
          <Route path="/" exact component={About} />
          <Route path="/about" exact component={About} />

          <Route path="/register" exact component={UserRegister} />
          <Route path="/login" exact component={UserLogin} />
          
          <Route path="/auth" exact component={Auth} />

          <Route component={NotFound}></Route>
        </Switch>

      </AuthProvider>
    </Router>
  );
}


