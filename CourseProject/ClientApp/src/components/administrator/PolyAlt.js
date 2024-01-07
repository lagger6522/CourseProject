import React, { Component } from 'react';
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
        };
    }

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
        this.setState({
            selectedClinic,
        });

        sendRequest(`api/Hospital/GetHospitalByClinicName?clinicName=${selectedClinic}`, 'GET')
            .then((hospital) => {
                this.setState({
                    addressCity: hospital.city,
                    addressStreet: hospital.street,
                    addressHouse: hospital.houseNumber,
                    registrationNumber: hospital.registrationNumber,
                    schedule: hospital.workingHours,
                    type: hospital.clinicType,
                });
            })
            .catch((error) => {
                console.error('Error loading hospital data:', error);
            });
    };

    handleFormSubmit = (e) => {
        e.preventDefault();

        const { selectedClinic, addressCity, addressStreet, addressHouse, registrationNumber, schedule, type } = this.state;
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
                console.log('Hospital updated successfully:', data);
            })
            .catch((error) => {
                console.error('Error updating hospital:', error);
            });
    };

    render() {
        return (
            <div className="form-container">
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
                            {this.state.clinics.map((clinic) => (
                                <option key={clinic} value={clinic}>
                                    {clinic}
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
                        <label htmlFor="registrationNumber">Номер регистратуры</label>
                        <input
                            type="text"
                            id="registrationNumber"
                            name="registrationNumber"
                            value={this.state.registrationNumber}
                            onChange={(e) => this.setState({ registrationNumber: e.target.value })}
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
                    </div>
                </form>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default PolyAlt;
