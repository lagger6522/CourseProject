import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import sendRequest from '../SendRequest';
import './PolyAdd.css';

export class PolyAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clinicName: '',
            addressCity: '',
            addressStreet: '',
            addressHouse: '',
            registrationNumber: '',
            schedule: '',
            type: 'adult',
            duplicateWarning: '',
            successMessage: '',
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            duplicateWarning: '',
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.isPhoneFullyEntered(this.state.registrationNumber)) {
            this.setState({ duplicateWarning: 'Пожалуйста, введите полный номер телефона.' });
            return;
        }

        sendRequest('api/Hospital/CheckDuplicate', 'POST', { clinicName: this.state.clinicName })
            .then((result) => {
                if (result.duplicate) {
                    this.setState({ duplicateWarning: 'Клиника с таким именем уже существует.' });
                } else {
                    sendRequest('api/Hospital/CheckPhoneDuplicate', 'POST', { registrationNumber: this.state.registrationNumber })
                        .then((phoneResult) => {
                            if (phoneResult.duplicate) {
                                this.setState({ duplicateWarning: 'Клиника с таким номером телефона уже существует.' });
                            } else {
                                sendRequest('api/Hospital/AddHospital', 'POST', this.state)
                                    .then((data) => {
                                        this.setState({ successMessage: 'Поликлиника успешно добавлена.' });

                                        setTimeout(() => {
                                            this.setState({ successMessage: '' });
                                        }, 2000);

                                        console.log('Hospital added successfully:', data);
                                    })
                                    .catch((error) => {
                                        console.error('Error adding hospital:', error);
                                    });
                            }
                        })
                        .catch((phoneError) => {
                            console.error('Error checking phone duplicate:', phoneError);
                        });
                }
            })
            .catch((error) => {
                console.error('Error checking duplicate:', error);
            });
    };

    isPhoneFullyEntered = (phone) => {
        const phoneRegex = /\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}/;
        return phoneRegex.test(phone);
    };

    render() {
        return (
            <div className="form-container">
                <h2>Форма для заполнения данных клиники</h2>
                {this.state.successMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{this.state.successMessage}</p>
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="clinicName">Наименование клиники</label>
                        <input
                            type="text"
                            id="clinicName"
                            name="clinicName"
                            value={this.state.clinicName}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressCity">Город</label>
                        <input
                            type="text"
                            id="addressCity"
                            name="addressCity"
                            value={this.state.addressCity}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressStreet">Улица</label>
                        <input
                            type="text"
                            id="addressStreet"
                            name="addressStreet"
                            value={this.state.addressStreet}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressHouse">Дом</label>
                        <input
                            type="text"
                            id="addressHouse"
                            name="addressHouse"
                            value={this.state.addressHouse}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registrationNumber">Номер регистратуры (телефонный номер)</label>
                        <InputMask
                            mask="+375 (99) 999-99-99"
                            maskChar="_"
                            id="registrationNumber"
                            name="registrationNumber"
                            value={this.state.registrationNumber}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="schedule">Время работы</label>
                        <input
                            type="text"
                            id="schedule"
                            name="schedule"
                            value={this.state.schedule}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Тип клиники</label>
                        <select
                            id="type"
                            name="type"
                            value={this.state.type}
                            onChange={this.handleChange}
                            required
                        >
                            <option value="adult">Взрослая</option>
                            <option value="pediatric">Детская</option>
                        </select>
                    </div>
                    {this.state.duplicateWarning && (
                        <div className="duplicate-warning">
                            <p>{this.state.duplicateWarning}</p>
                        </div>
                    )}
                    <button type="submit">Добавить поликлинику</button>
                </form>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default PolyAdd;