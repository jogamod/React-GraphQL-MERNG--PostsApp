import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Container } from 'semantic-ui-react';
import MenuBar from './components/MenuBar';

class App extends Component {
  render() {
    return (
     <Router>
       <Container>
        <MenuBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
       </Container>
     </Router>
    );
  }
}

export default App;
