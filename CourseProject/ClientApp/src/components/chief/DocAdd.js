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
    componentDidMount() {
        const selectedHospitalId = sessionStorage.getItem('hospitalId');
        console.log('Selected Hospital ID:', selectedHospitalId);
        this.setState({ selectedHospitalId });
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
            this.setState({ errorMessage: 'Введите корректный адрес электронной почты' });
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            this.setState({
                errorMessage: 'Пароль должен содержать минимум 8 символов, включая буквы и цифры',
            });
            return;
        }

        const selectedHospitalId = sessionStorage.getItem('hospitalId');

        sendRequest('/api/User/AddDoctor', 'POST', {
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            middleName,
            specialization,
            hospitalId: selectedHospitalId,
        })
            .then(response => {
                if (response.message) {
                    alert('Doctor added successfully:', response);
                }
            })
            .catch(error => {
                console.error('Error adding doctor:', error);
                this.setState({ errorMessage: 'Something went wrong while adding the doctor.' });
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
                        <option value="Терапевт">Терапевт</option>
                        <option value="Дерматолог">Дерматолог</option>
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
