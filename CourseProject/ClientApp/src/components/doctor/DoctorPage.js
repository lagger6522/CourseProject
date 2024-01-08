import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './DoctorPage.css';


export class DoctorPage extends Component {
    constructor(props) {
        super(props);
        const userId = sessionStorage.getItem("userId")
        this.state = {
            doctorId: userId,
            schedule: [],
            daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            newDay: '',
            newTime: '',
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.loadDoctorSchedule();
    }

    loadDoctorSchedule = () => {
        const { doctorId } = this.state;

        console.log(this.state.doctorId);
        sendRequest(`/api/Schedule/GetDoctorSchedule`, 'GET', null, { doctorId })
            .then(schedule => {
                this.setState({ schedule, errorMessage: '' });
                console.log(schedule);
            })
            .catch(error => {
                console.error('Error getting doctor schedule:', error);
                this.setState({ errorMessage: 'Something went wrong while fetching doctor schedule.' });
            });
    };

    render() {
        const { showMessage, message, schedule } = this.state;

        return (
            <div className="button-container"> 
                {showMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{message}</p>
                    </div>
                )}
                <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '5px' }}>День</th>
                            <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }} colSpan="4">Время</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((N) => (
                            <tr key={N.dayOfWeek}>
                                <td style={{ border: '1px solid black', padding: '5px' }}>{N.dayOfWeek}</td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    <label>Начало рабочего для: {N.startTime}</label>
                                </td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    <label>Конец рабочего для: {N.endTime}</label>
                                </td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    <label>Обед с : {N.lunchBreakStart}</label>
                                </td>
                                <td style={{ border: '1px solid black', padding: '5px' }}>
                                    <label>Обед по: {N.lunchBreakEnd}</label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>         

            </div>
        );
    }
}

export default DoctorPage;
