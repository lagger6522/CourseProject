import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './DoctorPage.css';

export class ChiefPage extends Component {
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
            <div className="button-container"> 
                {showMessage && (
                    <div className="success-message-container">
                        <p className="success-message">{message}</p>
                    </div>
                )}

            </div>
        );
    }
}

export default ChiefPage;
