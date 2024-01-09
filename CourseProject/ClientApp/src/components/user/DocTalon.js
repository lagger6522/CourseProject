import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import sendRequest from '../SendRequest';

class DocTalon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctor: null,
            hospitalId: null,
        };
    }

    componentDidMount() {
        this.loadDoctor();
    }

    loadDoctor = () => {
        const { userId, hospitalId } = this.props.match.params;

        sendRequest(`/api/User/GetDoctorById`, 'GET', null, { userId })
            .then((data) => {
                this.setState({ doctor: data, hospitalId });
            })
            .catch((error) => {
                console.error('Error fetching doctor data:', error);
            });
    };

    handleTakeTalon = () => {

    };

    render() {
        const { doctor } = this.state;

        return (
            <div>
                <h2>Doctor Talon</h2>
                {doctor ? (
                    <div>
                        <p>Name: {doctor.firstName} {doctor.lastName}</p>
                        <p>Specialization: {doctor.specialization}</p>
                        <button onClick={this.handleTakeTalon}>Take Talon</button>
                    </div>
                ) : (
                    <p>Loading doctor information...</p>
                )}
            </div>
        );
    }
}

export default DocTalon;