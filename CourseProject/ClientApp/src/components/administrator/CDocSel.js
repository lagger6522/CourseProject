import React, { Component } from 'react';
import sendRequest from '../SendRequest';
import './CDocSel.css';

export class CDocSel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chiefDoctors: [],
        };
    }

    componentDidMount() {
        this.loadChiefDoctors();
    }

    loadChiefDoctors = () => {
        sendRequest('api/User/GetAllChiefDoctors', 'GET')
            .then((chiefDoctors) => {
                this.setState({
                    chiefDoctors,
                });
            })
            .catch((error) => {
                console.error('Error loading chief doctors:', error);
            });
    };

    handleDeleteClick = (email) => {
        sendRequest('api/User/DeleteChiefDoctor', 'POST', null, { email })
            .then((response) => {
                console.log(response);
                const updatedChiefDoctors = this.state.chiefDoctors.filter((doctor) => doctor.email !== email);
                this.setState({ chiefDoctors: updatedChiefDoctors });
            })
            .catch((error) => {
                console.error('Error deleting chief doctor:', error);
            });
    };

    render() {
        return (
            <div className="doc-list-container">
                <h2>Список главврачей</h2>
                <ul>
                    {this.state.chiefDoctors.map((doctor) => (
                        <li key={doctor.email}>
                            {doctor.lastName} {doctor.firstName} {doctor.middleName}
                            <button onClick={() => this.handleDeleteClick(doctor.email)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default CDocSel;
