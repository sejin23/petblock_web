import React from 'react';
import { connect } from 'react-redux';
import Loading from './screens/Loading';
import Login from './screens/Login';
import Home from './screens/Home';

function AppBase({isFetching, isLoggedIn}) {
  return (
    (isFetching?
      <Loading />:
      (isLoggedIn?
        <Home />:
        <Login />)
    )
  );
}

const mapStateToProps = state => ({
  isFetching: state.user.isFetching,
  isLoggedIn: state.user.isLoggedIn
});

const App = connect(
  mapStateToProps
)(AppBase);

export default App;