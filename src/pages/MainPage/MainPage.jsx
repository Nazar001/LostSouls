import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Icon, Input, Button, message } from 'antd';
import './MainPage.scss';

class MainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            DataBase: [{
                id: 0,
                login: 'admin',
                password: 'admin'
            }]
        };
    }
    async handleSignIn(e) {
        e.preventDefault();
        let login = e.target[0].value;
        let password = e.target[1].value;
        let session;
        await fetch(`/signin/${login}/${password}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                return response.json()
            }).then(res =>
                session = res
            );
        if (session.length === 1) {
            if (session[0].login === login && session[0].password === password) {
                
            }
        }
    };
    // handleSignIn = (e) => {
    //     e.preventDefault();
    //     let temp = e.target;
    //     let db = this.state.DataBase;
    //     let reg = 0;
    //     db.forEach(el => {
    //         if (temp[0].value === el.login) {
    //             if (temp[1].value === el.password) {
    //                 reg = 1;
    //             } else {
    //                 reg = 2;
    //             }
    //         };
    //     });
    //     if (reg === 1) {
    //         window.localStorage.setItem('User', JSON.stringify(temp[0].value));
    //         this.props.history.push('MainPage');
    //     } else if (reg === 2) {
    //         message.error('You have entered the wrong password!');
    //     } else {
    //         message.error('You have entered the wrong login!');
    //     }

    // };

    handleSignUp = () => {
        this.props.history.push('signUp');
    };

    render() {
        return (
            <div className="center">
                Golovna
            </div>
        );
    }
};

export default withRouter(MainPage);