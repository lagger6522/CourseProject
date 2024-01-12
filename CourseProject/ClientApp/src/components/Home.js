import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from './SendRequest';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            showMessage: false,
            talons: [],
            patients: [],
            patientId: "",
            message: ''
        };
    }

    componentDidMount() {
        const redirectMessage = sessionStorage.getItem("redirectMessage");
        if (redirectMessage) {
            const message = redirectMessage;

            this.setState({ showMessage: true, message });
            setTimeout(() => {
                this.setState({ showMessage: false, message: "" });
                sessionStorage.removeItem("redirectMessage");
            }, 2000);
        }
        sendRequest("/api/Patient/GetPatientsByUser", "GET", null, { userId: sessionStorage.getItem("userId") })
            .then(n => {
                sendRequest("/api/Talon/GetTalons", "GET", null, { userId: sessionStorage.getItem("userId"), patientId: this.state.patientId ? this.state.patientId : null })
                    .then(k => {
                        this.setState({ talons: k.data, patients: n });
                    });
            });
    }
    selectTalons = () => {
        sendRequest("/api/Talon/GetTalons", "GET", null, { userId: sessionStorage.getItem("userId"), patientId: this.state.patientId ? this.state.patientId : null })
            .then(k => {
                this.setState({ talons: k.data });
            });
    }
    unbookTalon = (id) => {
        sendRequest("/api/Talon/DeleteTalon", "DELETE", null, {talonId:id})
            .then(k => {
                if (k.error) {
                    alert(k.error);
                    return;
                }
                this.setState({ showMessage: true, message:k.message },()=>this.selectTalons());
                setTimeout(() => {
                    this.setState({ showMessage: false, message: "" });
                    sessionStorage.removeItem("redirectMessage");
                }, 2000);
            });
    }
    render() {
        const { showMessage, message } = this.state;

        return (
            <div>
                {showMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{message}</p>
                    </div>
                )}

                <div>
                    <h2>Добро пожаловать в систему записи на прием</h2>
                    <p>Легко управляйте своими записями с помощью нашей системы.</p>
                    <h3>Ваши талоны</h3>
                    <select value={this.state.patientId} onChange={(e) => this.setState({ patientId: e.target.value },()=>this.selectTalons())}>
                        <option value="">All</option>
                        {this.state.patients.map(n => <option key={n.patientId} value={n.patientId}>{ n.lastName} {n.firstName }</option>) }
                    </select>
                    <ul>
                        {this.state.talons.length > 0 ? this.state.talons.map(n => <li key={n.talonId }>
                            <b>{n.patient ? n.patient.lastName : ""} {n.patient ? n.patient.firstName : ""} {n.patient ? n.patient.middleName : ""}</b><br />
                            <i>{new Date(n.orderDate).toLocaleDateString()} {n.orderTime}</i><br/>
                            <button onClick={()=>this.unbookTalon(n.talonId) }>Отменить</button>
                        </li>) : "Нет заказаных талонов"}
                    </ul>
                    <Link to="/appointment">
                        <button>Заказ талона</button>
                    </Link>
                </div>
            </div>
        );
    }
}
