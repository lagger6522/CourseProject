import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

export class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="button-container">
                <Link to="/administrator/AdminPolyPage" className="admin-button-link">
                    <button className="admin-button">Поликлиники</button>
                </Link>
                <Link to="/administrator/AdminCDocPage" className="admin-button-link">
                    <button className="admin-button">Главврачи</button>
                </Link>
            </div>
        );
    }
}

export default AdminPage;