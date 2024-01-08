import React, { Component } from 'react';
import './LoginPage.css';
import sendRequest from '../SendRequest';

export class EmailLoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            code: '',
            errorMessage: null,
            sendTime: null,
        };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSendCode = (e) => {
        e.preventDefault();
        const { email } = this.state;
        sendRequest("/api/User/SendCodeToEmail", "POST", null, { email })
            .then(data => {
                if (data.error) {
                    this.setState({ errorMessage: data.error });
                    return;
                }
                this.setState({ errorMessage: data.message });
                if (data.message) alert(data.message);
            }).catch(error => {
                this.setState({ errorMessage: error.message || "Произошла ошибка при входе. Пожалуйста, попробуйте снова." });
            });
    }
    handleLogin = async (e) => {
        e.preventDefault();

        const { email, code } = this.state;

        sendRequest("/api/User/LoginByEmail", "POST", null, { email, code })
            .then(data => {
                if (data.error) {
                    this.setState({ errorMessage: data.error });
                    return;
                }
                sessionStorage.setItem("userId", data.userId);
                sessionStorage.setItem("email", data.email);
                sessionStorage.setItem("role", data.role);
                sessionStorage.setItem("isAuthenticated", true);

                // Проверка роли и перенаправление
                if (data.role === 'User') {
                    window.location.href = "/"
                } else if (data.role === 'Admin') {
                    window.location.href = "/administrator/AdminPage"
                } else if (data.role === 'Chief Medical Officer') {
                    window.location.href = "/chief/ChiefPage"
                } else {
                    window.location.href = "/manager/ManagerPage"
                }
        }).catch(error => {
            this.setState({ errorMessage: error.message || "Произошла ошибка при входе. Пожалуйста, попробуйте снова." });
        });
    }

    render() {
        const { email, code, errorMessage } = this.state;

        return (
            <div>
                <form className="form" onSubmit={this.handleLogin}>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Ваш e-mail"
                        value={email}
                        onChange={this.handleInputChange}
                        required
                    />
                    <button disabled={this.state.sendTime && new Date() < this.state.sendTime} className="btn" onClick={this.handleSendCode}>Отправить код на email</button>
                </form>
                {this.state.sendTime &&
                    <form>
                        <input
                            className="input"
                            type="text"
                            name="code"
                            placeholder="Код"
                            value={code}
                            onChange={this.handleInputChange}
                            required
                        />
                        <button className="btn" type="submit">Авторизация</button>
                    </form>        
                }
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        );
    }
}

export default EmailLoginPage;
