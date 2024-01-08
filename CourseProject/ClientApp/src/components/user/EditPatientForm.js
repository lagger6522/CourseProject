import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class EditPatientForm extends Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search);
        const patientId = queryParameters.get("patientId");
        this.state = {
            patientId,
            patient: {
                firstName: '',
                lastName: '',
                middleName: '',
                birthDate: '',
                gender: '',
            },
        };
    }

    componentDidMount() {
        this.loadPatientData();
    }

    loadPatientData = () => {
        const { patientId } = this.state;
        sendRequest(`/api/Patient/GetPatientById`, 'GET', null, { patientId })
            .then((data) => {
                // Преобразование формата даты
                data.birthDate = new Date(data.birthDate).toISOString().split('T')[0];
                this.setState({ patient: data });
            })
            .catch((error) => {
                console.error('Error fetching patient data:', error);
            });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            patient: {
                ...prevState.patient,
                [name]: value,
            },
        }));
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const { patient, patientId } = this.state;
        sendRequest(`/api/Patient/UpdatePatient`, 'POST', patient, { patientId })
            .then(() => {
                console.log('Patient data updated successfully.');
            })
            .catch((error) => {
                console.error('Error updating patient data:', error);
            });
    };

    render() {
        const { patient } = this.state;

        return (
            <div>
                <h2>Edit Patient</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={patient.firstName}
                            onChange={this.handleInputChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={patient.lastName}
                            onChange={this.handleInputChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Middle Name:
                        <input
                            type="text"
                            name="middleName"
                            value={patient.middleName}
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Birth Date:
                        <input
                            type="date"
                            name="birthDate"
                            value={patient.birthDate}
                            onChange={this.handleInputChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Gender:
                        <select name="gender" value={patient.gender} onChange={this.handleInputChange} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <br />
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        );
    }
}

export default EditPatientForm; 
