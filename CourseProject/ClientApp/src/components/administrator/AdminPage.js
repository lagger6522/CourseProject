import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

export class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMessage: false,
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
                <div className="button-container">
                    <Link to="/administrator/AdminPolyPage" className="admin-button-link">
                        <button className="admin-button">Поликлиники</button>
                    </Link>
                    <Link to="/administrator/AdminCDocPage" className="admin-button-link">
                        <button className="admin-button">Главврачи</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default AdminPage;