import React, { Component } from 'react';
import './LoginPage.css';
import sendRequest from '../SendRequest';

export class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: null,
            showMessage: false,
            message: ''
        };
    }

    componentDidMount() {
        const redirectMessage = sessionStorage.getItem("redirectMessage");

        if (redirectMessage) {
            const message = redirectMessage;

            this.setState({ showMessage: true, message });

            setTimeout(() => {
                this.setState({ showMessage: false, message: "" });
                sessionStorage.removeItem("redirectMessage");
            }, 2000);
        }
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = this.state;

        sendRequest("/api/User/Login", "POST", {email, password }, null)
            .then(data => {
                if (!data || data.message) {
                    throw data ? data.message : {message:null};
                }
                sessionStorage.setItem("user",JSON.stringify(data));
                sessionStorage.setItem("hospitalId", data.hospitalId);
                sessionStorage.setItem("userId", data.userId); 
                sessionStorage.setItem("email", data.email);
                sessionStorage.setItem("role", data.role);
                sessionStorage.setItem("isAuthenticated", true);
                // Проверка роли и перенаправление
                if (data.role === 'User') {
                    window.location.href = "/";
                    sessionStorage.setItem("redirectMessage", "Вы успешно вошли за пользователя!");
                } else if (data.role === 'Admin') {
                    window.location.href = "/administrator/AdminPage";
                    sessionStorage.setItem("redirectMessage", "Вы успешно вошли за админа!");
                } else if (data.role === 'Chief Medical Officer') {
                    window.location.href = "/chief/ChiefPage";
                    sessionStorage.setItem("redirectMessage", "Вы успешно вошли за главврача!");
                } else {
                    window.location.href = "/doctor/DoctorPage";
                    sessionStorage.setItem("redirectMessage", "Вы успешно вошли за врача!");
                }
            }).catch(error => {
                console.log(error);
            this.setState({ errorMessage: error.message || "Произошла ошибка при входе. Пожалуйста, попробуйте снова." });
        });
    }

    render() {
        const { showMessage, message } = this.state;
        const { email, password, errorMessage } = this.state;

        return (
            <div>
                {showMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{message}</p>
                    </div>
                )}

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
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={this.handleInputChange}
                        required
                    />
                    <button className="btn" type="submit">Авторизация</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <sub><a href="/authentication/EmailLoginPage"><i>Войти спомощью google почты</i></a></sub>
                </form>
            </div>
        );
    }
}

export default LoginPage;
