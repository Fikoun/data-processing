import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AppNavbar from "./components/navbar.component";
import UserRegister from "./components/user/register.component";
import UserLogin from "./components/user/login.component";
import Documentation from "./components/documentation.component";
import About from "./components/about.component";
import Auth from "./components/auth.component";
import { AuthProvider } from './Context';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        
        <AppNavbar />

          {/* <Route path="/" exact component={MeasurementsList} />
          <Route path="/edit/:id" exact component={MeasurementEdit} />
          <Route path="/create" exact component={MeasurementCreate} />
          <Route path="/measurements/:id" exact component={Measurement} /> */}
        <ProtectedRoute path="/docs" permission="registered" exact component={Documentation} />
        
        <Route path="/about" exact component={About} />

        <Route path="/register" exact component={UserRegister} />
        <Route path="/login" exact component={UserLogin} />
        
        <Route path="/auth" exact component={Auth} />

      </AuthProvider>
    </Router>
  );
}


