
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
import Advising from './components/Advising';
import FacultyDashboard from './components/FacultyDashboard';
import Approve from './components/Approve';
import ViewResult from './components/ViewResult';
import Password from './components/Password';
import Logout from './components/Logout';


function App(props) {

  return (
    <Router>
      <div>
        <PrivateRoute path="/profile" component={Profile} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/user-management" component={UserManagement} isAuthenticated={props.isAuthenticated} />
        <Route path="/login" component={Login} exact />
        <Route path="/signup" component={Signup} exact />
        <PrivateRoute path="/set-profile" component={SetProfile} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/student-dashboard/:id" component={StudentDashboard} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/result/:id" component={Result} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/view/result/:id" component={ViewResult} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/advised-courses/:id" component={Advising} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/faculty-dashboard" component={FacultyDashboard} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/approve-advising/:id" component={Approve} isAuthenticated={props.isAuthenticated} />
        <PrivateRoute path="/password" component={Password} isAuthenticated={props.isAuthenticated} />
        <Route path="/logout" component={Logout} />
        <Route path="/" component={Login} exact />
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: localStorage.getItem('login') === 'true' ? true : false
});

export default connect(mapStateToProps)(App);