import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from '../SendRequest';

export class SpecList extends Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search);
        this.state = {
            doctors: [],
            hospitalId: queryParameters.get("hospitalId"),
        };
    }

    componentDidMount() {
        this.loadDoctors();
    }

    loadDoctors = () => {
        const { hospitalId } = this.state;
        sendRequest(`/api/User/GetDoctorsByHospital`, 'GET', null, { hospitalId })
            .then((data) => {
                this.setState({ doctors: data });
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
                    {doctors && doctors.map((doctor) => (
                        <li key={doctor.userId}>
                            <Link to={`/doctor-details?userId=${doctor.userId}`}>
                                <div>
                                    <p>Name: {doctor.firstName} {doctor.lastName}</p>
                                    <p>Specialization: {doctor.specialization}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default SpecList;
