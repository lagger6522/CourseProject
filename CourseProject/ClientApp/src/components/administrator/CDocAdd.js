import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './CDocAdd.css';

export class CDocAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            middleName: '',
            errorMessage: null,
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password, confirmPassword, firstName, lastName, middleName } = this.state;

        if (!email || !password || !confirmPassword || !firstName || !lastName || !middleName) {
            this.setState({ errorMessage: 'Пожалуйста, заполните все поля' });
            return;
        }

        sendRequest('/api/User/AddChiefDoctor', 'POST', {
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            middleName,
        })
            .then(response => {
                if (response.message) {
                    // Обработка успешного добавления главврача
                    console.log('Главврач добавлен успешно:', response);
                }
            })
            .catch(error => {
                // Обработка ошибок при добавлении главврача
                console.error('Ошибка добавления главврача:', error);
                this.setState({ errorMessage: 'Что-то пошло не так при добавлении главврача.' });
            });
    };

    render() {
        const { email, password, confirmPassword, firstName, lastName, middleName, errorMessage } = this.state;

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
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="lastName"
                        placeholder="Фамилия"
                        value={lastName}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="middleName"
                        placeholder="Отчество"
                        value={middleName}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="E-mail"
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
                    <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={this.handleInputChange}
                        required
                    />                    
                    <button className="btn" type="submit">
                        Добавить главврача
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        );
    }
}

export default CDocAdd;
