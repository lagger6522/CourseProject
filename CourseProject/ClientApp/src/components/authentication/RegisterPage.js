import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './RegisterPage.css';

export class RegisterPage extends Component {
    static displayName = RegisterPage.name;

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: null,
            Users: [],
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { firstName, lastName, middleName, email, password, confirmPassword } = this.state;

        if (!firstName || !lastName || !middleName || !email || !password || !confirmPassword) {
            this.setState({ errorMessage: 'Пожалуйста, заполните все поля' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ errorMessage: 'Введите корректный адрес электронной почты' });
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            this.setState({
                errorMessage: 'Пароль должен содержать минимум 8 символов, включая буквы и цифры',
            });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({ errorMessage: 'Пароли не совпадают' });
            return;
        }

        sendRequest("/api/User/Register", "POST", { firstName, lastName, middleName, email, password }, null)
            .then(response => {
                if (response.message) {
                    window.location.href = "/authentication/LoginPage";
                    sessionStorage.setItem("redirectMessage", "Вы успешно зарегистрировались!");
                }
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorMessage = error.response.data.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.';
                    this.setState({ errorMessage });

                    if (errorMessage !== "Пользователь с таким email уже зарегистрирован.") {
                        window.location.href = "/authentication/LoginPage";
                    }
                } else {
                    console.error('Произошла ошибка при входе:', error);
                    this.setState({ errorMessage: 'Что-то пошло не так, возможно эта почто уже зарегистрированна.' });
                }
            });
    };

    render() {
        const { firstName, lastName, middleName, email, password, confirmPassword, errorMessage } = this.state;

        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input
                        className="input"
                        type="text"
                        name="firstName"
                        placeholder="Имя"
                        value={firstName}
                        onChange={this.handleInputChange}
                    />
                    <input
                        className="input"
                        type="text"
                        name="lastName"
                        placeholder="Фамилия"
                        value={lastName}
                        onChange={this.handleInputChange}
                    />
                    <input
                        className="input"
                        type="text"
                        name="middleName"
                        placeholder="Отчество"
                        value={middleName}
                        onChange={this.handleInputChange}
                    />
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Ваш e-mail"
                        value={email}
                        onChange={this.handleInputChange}
                    />
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={this.handleInputChange}
                    />
                    <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                        placeholder="Пароль еще раз"
                        value={confirmPassword}
                        onChange={this.handleInputChange}
                    />
                    <button className="btn" type="submit">
                        Регистрация
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        );
    }
}

export default RegisterPage;
