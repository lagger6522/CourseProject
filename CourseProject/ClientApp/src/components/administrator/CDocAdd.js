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
            selectedHospital: null,
            hospitals: [],
            errorMessage: null,
            successMessage: '',
        };
    }

    componentDidMount() {
        sendRequest('/api/Hospital/GetHospitals', 'GET')
            .then((data) => {
                this.setState({ hospitals: data });
            })
            .catch((error) => {
                console.error('Error fetching hospital list:', error);
            });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password, confirmPassword, firstName, lastName, middleName, selectedHospital } = this.state;

        if (!email || !password || !confirmPassword || !firstName || !lastName || !middleName || !selectedHospital) {
            this.setState({ errorMessage: 'Пожалуйста, заполните все поля, включая выбор больницы' });
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

        sendRequest('/api/User/AddChiefDoctor', 'POST', {
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            middleName,
            hospitalID: selectedHospital,
        })
            .then((response) => {
                if (response.message) {
                    this.setState({ successMessage: 'Главврач успешно добавлен.' });

                    setTimeout(() => {
                        this.setState({ successMessage: '' });
                    }, 2000);
                    console.log('Главврач добавлен успешно:', response);
                }
            })
            .catch((error) => {
                console.error('Ошибка добавления главврача:', error);
                this.setState({ errorMessage: 'Что-то пошло не так при добавлении главврача.' });
            });
    };

    render() {
        const { email, password, confirmPassword, firstName, lastName, middleName, errorMessage, successMessage, selectedHospital, hospitals } = this.state;
        console.log(selectedHospital);
        return (
            <div>
                {successMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{successMessage}</p>
                    </div>
                )}
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
                    <select
                        className="input"
                        name="selectedHospital"
                        value={selectedHospital || ''}
                        onChange={this.handleInputChange}
                        required
                    >
                        <option value="" disabled hidden>
                            Выберите больницу
                        </option>
                        {hospitals.map((hospital) => (
                            <option key={hospital.hospitalID} value={hospital.hospitalID}>
                                {hospital.clinicName}
                            </option>
                        ))}
                    </select>

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
