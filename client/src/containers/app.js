import React, { Component } from 'react';
import { connect }  from 'react-redux';
import { loginUser } from '../actions/login';
import NavBar from '../components/navBar';
import UserProfile from '../components/userProfile'
import Login from '../components/login';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
  }
  render() {
    const { dispatch, errorMessage, isAuthenticated } = this.props;
    return (
      <div>
        <NavBar
        isAuthenticated={isAuthenticated}
        errorMessage={errorMessage}
        dispatch={dispatch}
        />
        <UserProfile />
      </div>
    );
  } 
}

const mapStateToProps = state => {
  const { auth } = state
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage
  }
}

export default connect(mapStateToProps)(App);