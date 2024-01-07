// DoctorList.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from '../SendRequest';

export class DoctorList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            doctors: [],
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.getDoctors();
    }

    getDoctors = () => {
        sendRequest('/api/User/GetDoctors', 'GET')
            .then(doctors => {
                this.setState({ doctors, errorMessage: '' });
            })
            .catch(error => {
                console.error('Error getting doctors:', error);
                this.setState({ errorMessage: 'Something went wrong while fetching doctors.' });
            });
    };

    handleDeleteDoctor = (UserId) => {
        sendRequest(`/api/User/DeleteDoctor`, 'DELETE', null, { UserId })
            .then(() => {
                this.getDoctors();
            })
            .catch(error => {
                console.error('Error deleting doctor:', error);
                this.setState({ errorMessage: 'Something went wrong while deleting the doctor.' });
            });
    };

    render() {
        const { doctors, errorMessage } = this.state;

        return (
            <div className="doctor-list-container">
                <h2>List of Doctors</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <ul>
                    {doctors.map(doctor => (
                        <li key={doctor.UserId}>
                            <strong>{doctor.lastName} {doctor.firstName} {doctor.middleName}</strong>
                            <p>Email: {doctor.email}</p>
                            <p>Specialization: {doctor.specialization}</p>
                            <p>UserId: {doctor.UserId}</p>
                            <Link to={`/schedule/edit/${doctor.UserId}`}>
                                <button>Edit Schedule</button>
                            </Link>
                            <button onClick={() => this.handleDeleteDoctor(doctor.email)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <Link to="/chief/DocAdd">
                    <button className="add-doctor-button">Add Doctor</button>
                </Link>
            </div>
        );
    }
}

export default DoctorList;
