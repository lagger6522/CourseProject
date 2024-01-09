import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class SpecList extends Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search);
        const hospitalId = queryParameters.get("hospitalId");
        this.state = {
            doctors: [],
            hospitalId,
        };
    }

    componentDidMount() {
        this.loadDoctors();
    }

    loadDoctors = (hospitalId) => {
        sendRequest(`/api/User/GetDoctorsByHospital`, 'GET', null, { hospitalId })
            .then((data) => {
                this.setState({ doctors: data });
                console.log(data);
            })
            .catch((error) => {
                console.error('Error fetching doctor list:', error);
            });
    };

    render() {
        const { doctors, hospitalId } = this.state;

        return (
            <div>
                <h2>Doctor List</h2>
                {hospitalId && <p>Doctors for Hospital ID: {hospitalId}</p>}
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor.userId}>
                            <p>Name: {doctor.firstName} {doctor.lastName}</p>
                            <p>Specialization: {doctor.specialization}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default SpecList;
