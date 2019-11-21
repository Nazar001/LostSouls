import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Form, Icon, Input, Button, message } from 'antd';
import './SignUpPage.scss';
import { isNumber } from 'util';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

class SignUpPage extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    async handleSignUp(e) {
        e.preventDefault();
        let temp = e.target;
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        let result;
        let date = year + "." + month + "." + day;
        await fetch(`/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: temp[0].value,
                refferal: temp[1].value,
                password: temp[2].value,
                status: "admin",
                date: date
            })
        })
            .then((response) => {
                return response.json()
            }).then(res =>
                result = res
            );
        if (result === "Login") {
            message.error('Даний логін вже використовується!');
        } else if (result === "Reff") {
            message.error('Невірний ключ!');
        } else if (result === "Reg") {
            message.error('Помилка реєстрації!');
        } if (typeof result == "number") {
            message.success('Користувач успішно зареєстрований!');
            window.localStorage.setItem('Login', JSON.stringify(temp[0].value));
            window.localStorage.setItem('Status', JSON.stringify("Admin"));
            setTimeout(() => {
                this.props.history.push('main');
            }, 2000);
        }
    };

    handleSignIn = () => {
        this.props.history.push('signIn');
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="center-reg">
                <div className="sign-up-form">
                    <Form onSubmit={this.handleSignUp} className="login-form">
                        <Form.Item label="Логін">
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        message: 'Логін вказано з помилкою',
                                    },
                                    {
                                        required: true,
                                        message: 'Будь-ласка введіть логін!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Ключ для реєстрації">
                            {getFieldDecorator('refferal', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Будь-ласка введіть ключ, який надав Вам адміністратор!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Пароль" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Будь-ласка введіть пароль!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item label="Повтор пароля" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Будь-ласка введіть пароль ще раз!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>
                        <Form.Item className="gor-center">
                            <Button type="primary" htmlType="submit" className="login-form-button">Зареєструватися</Button> або <a onClick={this.handleSignIn}>ввійдіть!</a>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
};

export default Form.create()(withRouter(SignUpPage));