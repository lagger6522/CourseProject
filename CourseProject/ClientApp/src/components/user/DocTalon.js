import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class DocTalon extends Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search);
        this.state = {
            doctorId: queryParameters.get("userId"),
            doctor: null,
            userId: sessionStorage.getItem('userId'),
            patients: [],
            patientId: "",
            orderDate: "",
            orderTime: null,
            times: [],
            scheduleId: null,
            errorMessage:""
        };
        this.loadData = this.loadData.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        const { doctorId, userId } = this.state;
        if (!doctorId) {
            // Добавьте обработку, например, перенаправление или вывод сообщения об ошибке
            console.error('Docktor ID is missing.');
            return;
        }
        if (!userId) {
            // Добавьте обработку, например, перенаправление или вывод сообщения об ошибке
            console.error('User ID is missing.');
            return;
        }
        sendRequest(`/api/Patient/GetPatientsByUser`, 'GET', null, { userId: userId })
            .then((data) => {
                this.setState({ patients: data });
            })
            .catch((error) => {
                console.error('Error fetching doctor data:', error);
            });
        sendRequest(`/api/User/GetDoctorById`, 'GET', null, { userId:doctorId })
            .then((data) => {
                this.setState({ doctor: data });
            })
            .catch((error) => {
                console.error('Error fetching patients data:', error);
            });
    };

    handleTakeTalon = () => {
        if (!this.state.patientId) {
            this.setState({ errorMessage: "Выбирите пациента для записи" });
            return;
        }
        if (!this.state.orderDate) {
            this.setState({ errorMessage: "Выбирите дату для записи" });
            return;
        }
        if (!this.state.orderTime) {
            this.setState({ errorMessage: "Выбирите время для записи" });
            return;
        }
        let data = {
            scheduleId: this.state.scheduleId,
            patientId: this.state.patientId,
            orderDate: this.state.orderDate,
            orderTime: this.state.orderTime,
        };
        sendRequest(`/api/Talon/OrderTalon`, 'POST', null, data)
            .then((data) => {
                alert(data.message);
                this.setState({
                    scheduleId: "",
                    patientId: "",
                    orderDate: "",
                    orderTime: "",
                });
            })
            .catch((error) => {
                console.error('Error fetching available talons data:', error);
            });
    };
    now() {
        var date = new Date().toLocaleDateString().split(".");
        return date.reverse().join("-");
    }
    onDateSelected(e) {
        this.setState({ orderDate: e.target.value }, () => {
            console.log({ userId: this.state.doctorId, date: this.state.orderDate });
            sendRequest(`/api/Talon/GetAvailableTalons`, 'GET', null, { docktorId: this.state.doctorId, date: this.state.orderDate })
                .then((data) => {
                    console.log(data);
                    this.setState({ times: data });
                })
                .catch((error) => {
                    console.error('Error fetching available talons data:', error);
                });
        });
    }
    render() {
        const { doctor } = this.state;

        return (
            <div>
                <h2>Doctor Talon</h2>
                {doctor ? (
                    <div>
                        <p>Name: {doctor.firstName} {doctor.lastName}</p>
                        <p>Specialization: {doctor.specialization}</p>
                        <select value={this.state.patientId} onChange={(e) => this.setState({patientId:e.target.value}) }>
                            <option disabled value="">Выбирите пациента</option>
                            {this.state.patients.map(n => <option key={n.patientId} value={n.patientId }>
                                {n.lastName} {n.firstName} Пол:{n.gender == "Male"?"Мужской": "Женский"} 
                            </option>)}
                        </select><br/>
                        <span>Выберите дату на которую хотите записаться</span>
                        <input type="date" min={this.now()} value={this.state.orderDate} onChange={this.onDateSelected } /><br />
                        {this.state.orderDate ?
                            (this.state.times.length > 0 ? this.state.times.map(n => <button key={n.time} disabled={!n.isAvailable}
                                onClick={() => this.setState({ orderTime: n.time, scheduleId: n.sheduleId })}
                                style={this.state.orderTime === n.time?{backgroundColor: "green"}:null}>
                                {n.time }
                            </button>) : <p>Нет талонов</p>)
                            : null}<br />
                        <p style={{color:"red"} }>{this.state.errorMessage}</p>
                        <button disabled={!this.state.orderTime } onClick={this.handleTakeTalon}>Take Talon</button>
                    </div>
                ) : (
                    <p>Loading doctor information...</p>
                )}
            </div>
        );
    }
}

export default DocTalon;
