import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import { render } from 'react-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={SignInPage} />
                <Route path="/signIn" exact component={SignInPage} />
                <Route path="/signUp" component={SignUpPage} />
                <Route path="/main" component={MainPage} />
            </Router>
        );
    }
}

render(<App />, document.getElementById('root'));