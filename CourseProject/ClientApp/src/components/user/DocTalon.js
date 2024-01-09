import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class DocTalon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctor: null,
            hospitalId: null,
        };
    }

    componentDidMount() {
        this.loadDoctor();
        const userId = sessionStorage.getItem('userId'); // пользователь заказывающий талон
    }

    loadDoctor = () => {
        const { params } = this.props.match || {};
        const { userId, hospitalId } = params || {};

        if (!userId) {
            // Добавьте обработку, например, перенаправление или вывод сообщения об ошибке
            console.error('User ID is missing.');
            return;
        }

        sendRequest(`/api/User/GetDoctorById`, 'GET', null, { userId })
            .then((data) => {
                this.setState({ doctor: data, hospitalId });
            })
            .catch((error) => {
                console.error('Error fetching doctor data:', error);
            });
    };

    handleTakeTalon = () => {
        // Ваш код для взятия талона
        console.log('Talon taken for doctor:', this.state.doctor);
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
