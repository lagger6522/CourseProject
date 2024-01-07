import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class EditSchedulePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            doctorId: this.props.match.params.id,
            schedule: [], // Добавьте расписание в состояние компонента
            newDay: '', // Добавьте новый день и время в состояние
            newTime: '',
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.loadDoctorSchedule();
    }

    loadDoctorSchedule = () => {
        const { doctorId } = this.state;

        sendRequest(`/api/Schedule/GetDoctorSchedule/${doctorId}`, 'GET')
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
                // Возможно, вы захотите перенаправить пользователя после успешного сохранения
            })
            .catch(error => {
                console.error('Error updating doctor schedule:', error);
                this.setState({ errorMessage: 'Something went wrong while updating doctor schedule.' });
            });
    };

    handleTimeChange = (dayIndex, timeIndex, event) => {
        const { schedule } = this.state;
        const updatedSchedule = [...schedule];
        updatedSchedule[dayIndex][timeIndex] = event.target.value;
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
        const { schedule, newDay, newTime, errorMessage } = this.state;

        return (
            <div className="edit-schedule-container">
                <h2>Edit Doctor Schedule</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((day, dayIndex) => (
                            <tr key={dayIndex}>
                                <td>{day[0]}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={day[1]}
                                        onChange={event => this.handleTimeChange(dayIndex, 1, event)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <h3>Add New Schedule Item</h3>
                    <label>Day:</label>
                    <input type="text" value={newDay} onChange={this.handleNewDayChange} />
                    <label>Time:</label>
                    <input type="text" value={newTime} onChange={this.handleNewTimeChange} />
                    <button onClick={this.handleAddSchedule}>Add</button>
                </div>
                <button onClick={this.handleSaveSchedule}>Save Schedule</button>
            </div>
        );
    }
}

export default EditSchedulePage;