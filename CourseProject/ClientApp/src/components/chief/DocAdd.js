import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './DocAdd.css';

export class DocAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            middleName: '',
            specialization: '',
            errorMessage: null,
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password, confirmPassword, firstName, lastName, middleName, specialization } = this.state;

        if (!email || !password || !confirmPassword || !firstName || !lastName || !middleName || !specialization) {
            this.setState({ errorMessage: 'Please fill in all fields' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ errorMessage: 'Enter a valid email address' });
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            this.setState({
                errorMessage: 'Password must be at least 8 characters and include letters and numbers',
            });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({ errorMessage: 'Passwords do not match' });
            return;
        }

        sendRequest('/api/User/AddDoctor', 'POST', {
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            middleName,
            specialization,
        })
            .then(response => {
                if (response.message) {
                    console.log('Doctor added successfully:', response);
                }
            })
            .catch(error => {
                this.setState({ errorMessage: 'Пользователь с такой почтой уже зарегистрирован' });

            });
    };

    render() {
        const { email, password, confirmPassword, firstName, lastName, middleName, specialization, errorMessage } = this.state;

        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    <input
                        className="input"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input
                        className="input"
                        type="text"
                        name="middleName"
                        placeholder="Middle Name"
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
                        placeholder="Password"
                        value={password}
                        onChange={this.handleInputChange}
                        required
                    />
                    <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={this.handleInputChange}
                        required
                    />
                    <select
                        className="input"
                        name="specialization"
                        value={specialization}
                        onChange={this.handleInputChange}
                        required
                    >
                        <option value="" disabled>Выберите специализацию</option>
                        <option value="Cardiologist">Кардиолог</option>
                        <option value="Dermatologist">Дерматолог</option>
                    </select>
                    <button className="btn" type="submit">
                        Добавить
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        );
    }
}

export default DocAdd;
