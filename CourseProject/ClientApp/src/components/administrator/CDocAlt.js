import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './CDocAlt.css';

export class CDocAlt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chiefDoctors: [],
            selectedChiefDoctor: '',
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.loadChiefDoctors();
    }

    loadChiefDoctors = () => {
        sendRequest('api/User/GetAllChiefDoctors', 'GET')
            .then((chiefDoctors) => {
                this.setState({
                    chiefDoctors,
                });
            })
            .catch((error) => {
                console.error('Error loading chief doctors:', error);
            });
    };

    handleChiefDoctorChange = (e) => {
        const selectedChiefDoctor = e.target.value;
        const selectedDoctor = this.state.chiefDoctors.find((doctor) => doctor.email === selectedChiefDoctor);

        this.setState({
            selectedChiefDoctor,
            firstName: selectedDoctor?.firstName || '',
            lastName: selectedDoctor?.lastName || '',
            middleName: selectedDoctor?.middleName || '',
            email: selectedDoctor?.email || '',
            errorMessage: '',
        });
    };

    handleFormSubmit = (e) => {
        e.preventDefault();

        const { selectedChiefDoctor, firstName, lastName, middleName, email } = this.state;

        if (!selectedChiefDoctor) {
            this.setState({ errorMessage: 'Пожалуйста, выберите главврача.' });
            return;
        }

        if (!email) {
            this.setState({ errorMessage: 'Пожалуйста, введите email.' });
            return;
        }

        // Добавим простую валидацию email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.setState({ errorMessage: 'Введите корректный адрес электронной почты.' });
            return;
        }

        const requestData = {
            originalEmail: selectedChiefDoctor,
            firstName,
            lastName,
            middleName,
            email,
        };

        sendRequest('api/User/UpdateChiefDoctor', 'POST', requestData)
            .then((data) => {
                console.log('Chief Doctor updated successfully:', data);
                this.loadChiefDoctors();
            })
            .catch((error) => {
                console.error('Error updating chief doctor:', error);
            });
    };

    render() {
        return (
            <div className="form-container">
                <h2>Изменение данных главврача</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="chiefDoctorSelect">Выберите главврача</label>
                        <select
                            id="chiefDoctorSelect"
                            name="chiefDoctorSelect"
                            value={this.state.selectedChiefDoctor}
                            onChange={this.handleChiefDoctorChange}
                            required
                        >
                            <option value="" disabled>Select a chief doctor</option>
                            {this.state.chiefDoctors.map((doctor) => (
                                <option key={doctor.email} value={doctor.email}>
                                    {doctor.lastName} {doctor.firstName} {doctor.middleName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Имя</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={(e) => this.setState({ firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Фамилия</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={(e) => this.setState({ lastName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="middleName">Отчество</label>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={this.state.middleName}
                            onChange={(e) => this.setState({ middleName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Изменить" style={{ width: '100%' }} />
                        {this.state.errorMessage && (
                            <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
                        )}
                    </div>
                </form>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default CDocAlt;
