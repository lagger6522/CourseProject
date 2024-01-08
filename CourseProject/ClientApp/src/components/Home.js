import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
    static displayName = Home.name;

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

                <div>
                    <h2>Welcome to the Appointment System</h2>
                    <p>Manage your appointments easily with our system.</p>
                    <Link to="/appointment">
                        <button>Order Appointment</button>
                    </Link>
                </div>
            </div>
        );
    }
}
