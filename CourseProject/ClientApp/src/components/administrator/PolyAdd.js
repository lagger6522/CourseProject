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
                        <textarea
                            id="schedule"
                            name="schedule"
                            rows="4"
                            value={this.state.schedule}
                            onChange={this.handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Тип клиники</label>
                        <div>
                            <label htmlFor="typeAdult">
                                <input
                                    type="radio"
                                    id="typeAdult"
                                    name="type"
                                    value="adult"
                                    checked={this.state.type === 'adult'}
                                    onChange={this.handleChange}
                                    required
                                />{' '}
                                Взрослая
                            </label>
                        </div>
                        <div>
                            <label htmlFor="typeChild">
                                <input
                                    type="radio"
                                    id="typeChild"
                                    name="type"
                                    value="child"
                                    checked={this.state.type === 'child'}
                                    onChange={this.handleChange}
                                    required
                                />{' '}
                                Детская
                            </label>
                        </div>
                        <div>
                            <label htmlFor="typeSpecialized">
                                <input
                                    type="radio"
                                    id="typeSpecialized"
                                    name="type"
                                    value="specialized"
                                    checked={this.state.type === 'specialized'}
                                    onChange={this.handleChange}
                                    required
                                />{' '}
                                Специализированная
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Добавить" style={{ width: '100%' }} />
                        {this.state.duplicateWarning && (
                            <p style={{ color: 'red' }}>{this.state.duplicateWarning}</p>
                        )}
                    </div>
                </form>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default PolyAdd;
