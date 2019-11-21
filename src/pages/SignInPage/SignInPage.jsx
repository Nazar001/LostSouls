import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Icon, Input, Button, message } from 'antd';
import './SignInPage.scss';

class SignInPage extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleSignIn = this.handleSignIn.bind(this);
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
                window.localStorage.setItem('Login', JSON.stringify(session[0].login));
                window.localStorage.setItem('Status', JSON.stringify(session[0].status));
                this.props.history.push('main');
            }
        } else {
            message.error('Введенний невірний логін або пароль!');
        }
    };

    handleSignUp = () => {
        this.props.history.push('signUp');
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="center">
                <div className="sign-in-form">
                    <Form onSubmit={this.handleSignIn} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Введіть логін!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Логін"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Введіть пароль' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Пароль"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className="gor-center">
                            <Button type="primary" htmlType="submit" className="login-form-button">Ввійти</Button> або <a href="" onClick={this.handleSignUp}>зареєструватися!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
};

export default Form.create()(withRouter(SignInPage));