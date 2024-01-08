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
                var s = this.state.daysOfWeek.map(n => schedule.find(k => k && k.dayOfWeek === n) || 
                        { dayOfWeek: n, startTime: '', endTime: '', lunchBreakStart: '', lunchBreakEnd: '' });
                this.setState({ schedule: s, errorMessage: '' });
            })
            .catch(error => {
                console.error('Error getting doctor schedule:', error);
                this.setState({ errorMessage: 'Something went wrong while fetching doctor schedule.' });
            });
    };

    handleSaveSchedule = () => {
        const { doctorId, schedule } = this.state;  
        var filtered = schedule.filter(n => n && n.lunchBreakEnd !== "");
        sendRequest(`/api/Schedule/UpdateDoctorSchedule`, 'POST', filtered, { doctorId })
            .then(() => {
                console.log('Doctor schedule updated successfully.');
            })
            .catch(error => {
                console.error('Error updating doctor schedule:', error);
                this.setState({ errorMessage: 'Something went wrong while updating doctor schedule.' });
            });
    };

    handleTimeChange = (dayIndex, field, event, min="6:00", max="24:00") => {
        let [hMin, mMin] = min.split(":");
        let [hMax, mMax] = max.split(":");
        min = hMin * 60 + (+mMin);
        max = hMax * 60 + (+mMax);
        console.log(min, max);
        const { schedule, daysOfWeek } = this.state;
        const updatedSchedule = [...schedule];
        if (!updatedSchedule[dayIndex]) {
            updatedSchedule[dayIndex] = { dayOfWeek: daysOfWeek[dayIndex], startTime: '', endTime: '', lunchBreakStart: '', lunchBreakEnd: '' };
        }
        let time = event.target.value;
        if (time.length !== 0) {
            let [h, m] = time.split(":");
            let actualTime = h * 60 + (+m);
            actualTime = Math.max(min, Math.min(max, actualTime));
            m = actualTime % 60;
            h = (actualTime - m) / 60;
            time = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
        }
        updatedSchedule[dayIndex][field] = time;
        console.log(dayIndex, field, updatedSchedule);
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
                                        min="6:00" 
                                        max="18:00"
                                        value={schedule[dayIndex] ? schedule[dayIndex]["startTime"] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, "startTime", event,"6:00","18:00")}
                                    />
                                </td>
                                <td>
                                    <label>Конец рабочего для:</label>
                                    <input
                                        disabled={!(schedule[dayIndex] && schedule[dayIndex]["startTime"])}
                                        type="time"
                                        min={schedule[dayIndex] ? schedule[dayIndex]["startTime"] : '6:00'} 
                                        value={schedule[dayIndex] ? schedule[dayIndex]["endTime"] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, "endTime", event, 
                                            schedule[dayIndex] ? schedule[dayIndex]["startTime"] : '6:00', "24:00")}
                                    />
                                </td>
                                <td>
                                    <label>Обед с:</label>
                                    <input
                                        disabled={!(schedule[dayIndex] && schedule[dayIndex]["endTime"])}
                                        type="time"
                                        min={schedule[dayIndex] ? schedule[dayIndex]["startTime"] : '6:00'}
                                        max={schedule[dayIndex] ? schedule[dayIndex]["endTime"] : '24:00'}
                                        value={schedule[dayIndex] ? schedule[dayIndex]["lunchBreakStart"] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, "lunchBreakStart", event,
                                            schedule[dayIndex] ? schedule[dayIndex]["startTime"] : '6:00',
                                            schedule[dayIndex] ? schedule[dayIndex]["endTime"] : '24:00')}
                                    />
                                </td>
                                <td>
                                    <label>По:</label>
                                    <input
                                        disabled={!(schedule[dayIndex] && schedule[dayIndex]["lunchBreakStart"])}
                                        type="time"
                                        min={schedule[dayIndex] ? schedule[dayIndex]["lunchBreakStart"] : '6:00'}
                                        max={schedule[dayIndex] ? schedule[dayIndex]["endTime"] : '24:00'}
                                        value={schedule[dayIndex] ? schedule[dayIndex]["lunchBreakEnd"] : ''}
                                        onChange={event => this.handleTimeChange(dayIndex, "lunchBreakEnd", event,
                                            schedule[dayIndex] ? schedule[dayIndex]["lunchBreakStart"] : '6:00',
                                            schedule[dayIndex] ? schedule[dayIndex]["endTime"] : '24:00')}
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
