import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import sendRequest from '../SendRequest';
import './PolyAlt.css';

export class PolyAlt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clinics: [],
            selectedClinic: '',
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

    componentDidMount() {
        this.loadClinics();
    }

    loadClinics = () => {
        sendRequest('api/Hospital/GetAllHospitals', 'GET')
            .then((clinics) => {
                this.setState({
                    clinics,
                });
            })
            .catch((error) => {
                console.error('Error loading clinics:', error);
            });
    };

    handleClinicChange = (e) => {
        const selectedClinic = e.target.value;
        const selectedHospital = this.state.clinics.find((hospital) => hospital.clinicName === selectedClinic);

        this.setState({
            selectedClinic,
            addressCity: selectedHospital.city,
            addressStreet: selectedHospital.street,
            addressHouse: selectedHospital.houseNumber,
            registrationNumber: selectedHospital.registrationNumber,
            schedule: selectedHospital.workingHours,
            type: selectedHospital.clinicType,
        });
    };

    handleFormSubmit = (e) => {
        e.preventDefault();

        if (!this.isPhoneFullyEntered(this.state.registrationNumber)) {
            this.setState({ duplicateWarning: 'Пожалуйста, введите полный номер телефона.' });
            return;
        }

        const { selectedClinic, addressCity, addressStreet, addressHouse, registrationNumber, schedule, type } = this.state;

        const originalHospital = this.state.clinics.find((hospital) => hospital.clinicName === selectedClinic);
        const originalPhoneNumber = originalHospital.registrationNumber;

        if (registrationNumber === originalPhoneNumber) {
            const requestData = {
                clinicName: selectedClinic,
                addressCity,
                addressStreet,
                addressHouse,
                registrationNumber,
                schedule,
                type,
            };

            sendRequest('api/Hospital/UpdateHospital', 'POST', requestData)
                .then((data) => {
                    this.setState({ successMessage: 'Данные поликлиники успешно изменены.' });

                    setTimeout(() => {
                        this.setState({ successMessage: '' });
                    }, 2000);
                    console.log('Hospital updated successfully:', data);
                })
                .catch((error) => {
                    console.error('Error updating hospital:', error);
                });
        } else {
            sendRequest('api/Hospital/CheckPhoneDuplicate', 'POST', { registrationNumber: this.state.registrationNumber })
                .then((phoneResult) => {
                    if (phoneResult.duplicate) {
                        this.setState({ duplicateWarning: 'Клиника с таким номером телефона уже существует.' });
                    } else {
                        const requestData = {
                            clinicName: selectedClinic,
                            addressCity,
                            addressStreet,
                            addressHouse,
                            registrationNumber,
                            schedule,
                            type,
                        };

                        sendRequest('api/Hospital/UpdateHospital', 'POST', requestData)
                            .then((data) => {
                                this.setState({ successMessage: 'Данные поликлиники успешно изменены.' });

                                setTimeout(() => {
                                    this.setState({ successMessage: '' });
                                }, 2000);
                                console.log('Hospital updated successfully:', data);
                            })
                            .catch((error) => {
                                console.error('Error updating hospital:', error);
                            });
                    }
                })
                .catch((phoneError) => {
                    console.error('Error checking phone duplicate:', phoneError);
                });
        }
    };

    isPhoneFullyEntered = (phone) => {
        const phoneRegex = /\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}/;
        return phoneRegex.test(phone);
    };

    render() {
        return (
            <div className="form-container">
                {this.state.successMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{this.state.successMessage}</p>
                    </div>
                )}
                <h2>Изменение данных клиники</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="clinicSelect">Выберите клинику</label>
                        <select
                            id="clinicSelect"
                            name="clinicSelect"
                            value={this.state.selectedClinic}
                            onChange={this.handleClinicChange}
                            required
                        >
                            <option value="" disabled>Select a clinic</option>
                            {this.state.clinics.map((hospital) => (
                                <option key={hospital.hospitalId} value={hospital.clinicName}>
                                    {hospital.clinicName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressCity">Город</label>
                        <input
                            type="text"
                            id="addressCity"
                            name="addressCity"
                            value={this.state.addressCity}
                            onChange={(e) => this.setState({ addressCity: e.target.value })}
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
                            onChange={(e) => this.setState({ addressStreet: e.target.value })}
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
                            onChange={(e) => this.setState({ addressHouse: e.target.value })}
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
                            onChange={(e) => this.setState({ schedule: e.target.value })}
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
                                    onChange={() => this.setState({ type: 'adult' })}
                                    required
                                /> Взрослая
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
                                    onChange={() => this.setState({ type: 'child' })}
                                    required
                                /> Детская
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
                                    onChange={() => this.setState({ type: 'specialized' })}
                                    required
                                /> Специализированная
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Изменить" style={{ width: '100%' }} />
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

export default PolyAlt;
