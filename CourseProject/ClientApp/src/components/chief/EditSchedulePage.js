import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class EditSchedulePage extends Component {

    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search)
        const userId = queryParameters.get("userId")
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

        sendRequest(`/api/Schedule/GetDoctorSchedule`, 'GET', null, { doctorId } )
            .then(schedule => {
                this.setState({ schedule, errorMessage: '' });
            })
            .catch(error => {
                console.error('Error getting doctor schedule:', error);
                this.setState({ errorMessage: 'Something went wrong while fetching doctor schedule.' });
            });
    };

    handleSaveSchedule = () => {
        const { doctorId, schedule } = this.state;

        sendRequest(`/api/Schedule/UpdateDoctorSchedule/${doctorId}`, 'POST', { schedule })
            .then(() => {
                console.log('Doctor schedule updated successfully.');
            })
            .catch(error => {
                console.error('Error updating doctor schedule:', error);
                this.setState({ errorMessage: 'Something went wrong while updating doctor schedule.' });
            });
    };

    handleTimeChange = (dayIndex, field, event) => {
        const { schedule } = this.state;
        const updatedSchedule = [...schedule];
        if (!updatedSchedule[dayIndex]) {
            updatedSchedule[dayIndex] = { DayOfWeek: '', StartTime: '', EndTime: '', LunchBreakStart: '', LunchBreakEnd: '' };
        }
        updatedSchedule[dayIndex][field] = event.target.value;
        this.setState({ schedule: updatedSchedule });
    };

    handleNewDayChange = event => {
        this.setState({ newDay: event.target.value });
    };

    handleNewTimeChange = event => {
        this.setState({ newTime: event.target.value });
    };

    handleAddSchedule = () => {
        const { newDay, newTime, schedule } = this.state;
        const newScheduleItem = [newDay, newTime];
        const updatedSchedule = [...schedule, newScheduleItem];
        this.setState({ schedule: updatedSchedule, newDay: '', newTime: '' });
    };

    render() {
        const { schedule, newDay, newTime, errorMessage, daysOfWeek } = this.state;
        return (
            <div className="edit-schedule-container">
                <h2>Edit Doctor Schedule</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>День</th>
                            <th>Время</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysOfWeek.map((day, dayIndex) => (
                            <tr key={dayIndex}>
                                <td>{day}</td>
                                <td>
                                    <label>Начало рабочего для:</label>
                                    <input
                                        type="time"
                                        value={schedule[dayIndex] ? schedule[dayIndex][1] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, 1, event)}
                                    />
                                </td>
                                <td>
                                    <label>Конец рабочего для:</label>
                                    <input
                                        type="time"
                                        value={schedule[dayIndex] ? schedule[dayIndex][2] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, 2, event)}
                                    />
                                </td>
                                <td>
                                    <label>Обед с:</label>
                                    <input
                                        type="time"
                                        value={schedule[dayIndex] ? schedule[dayIndex][3] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, 3, event)}
                                    />
                                </td>
                                <td>
                                    <label>По:</label>
                                    <input
                                        type="time"
                                        value={schedule[dayIndex] ? schedule[dayIndex][4] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, 4, event)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>                
                <button onClick={this.handleSaveSchedule}>Save Schedule</button>
            </div>
        );
    }
}

export default EditSchedulePage;
