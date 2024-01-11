import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './PolyList.css';

export class PolyList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hospitals: [],
        };
    }

    componentDidMount() {
        this.loadHospitals();
    }

    loadHospitals() {
        sendRequest('api/Hospital/GetAllHospitals', 'GET')
            .then((data) => {
                this.setState({ hospitals: data });
            })
            .catch((error) => {
                console.error('Error loading hospitals:', error);
            });
    }

    handleDeleteHospital(hospitalId) {
        sendRequest(`api/Hospital/DeleteHospital`, 'DELETE', null, {hospitalId})
            .then(() => {
                console.log('Hospital deleted successfully');
                this.loadHospitals();
            })
            .catch((error) => {
                console.error('Error deleting hospital:', error);
            });
    }

    render() {
        let type = { "adult": "Взрослая", "pediatric": "Детская", "Specialized": "Специализированная"}
        return (
            <div>
                <h2>Список больниц</h2>
                <ul>
                    {this.state.hospitals.map((hospital) => (
                        <li key={hospital.hospitalId}>
                            <strong>
                                {hospital.hospitalId}){type[hospital.clinicType]}
                                {hospital.clinicName.toLowerCase().indexOf("поликлиника") === -1 ? " поликлиника" : " "} {hospital.clinicName} -{" "}
                                {hospital.city} {hospital.street} д.{hospital.houseNumber}
                            </strong><br />
                            <i>Регистрация: {hospital.registrationNumber}. Время работы {hospital.workingHours}</i><br />
                            <button onClick={() => this.handleDeleteHospital(hospital.hospitalId)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default PolyList;