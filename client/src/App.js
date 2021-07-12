
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from "react-private-public-route";
import Login from './components/Login';
import { useState } from "react";
import Profile from './components/Profile';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { connect } from 'react-redux';
import Signup from './components/Signup';
import './App.css';
import SetProfile from './components/SetProfile';
import UserManagement from './components/UserManagement';
import StudentDashboard from './components/StudentDashboard';
import Result from './components/Result';


function App(props) {

  return (
    <Router>
      <div>
        <PrivateRoute path="/profile" component={Profile} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/user-management" component={UserManagement} isAuthenticated={props.isAuthenticated} />
        <Route path="/login" component={Login} exact />
        <Route path="/signup" component={Signup} exact />
        <Route path="/set-profile" component={SetProfile} exact />
        <Route path="/student-dashboard" component={StudentDashboard} exact />
        <Route path="/result/:id" component={Result} />
        <Route path="/" component={Login} exact />
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: localStorage.getItem('login') === 'true' ? true : false
});

export default connect(mapStateToProps)(App);