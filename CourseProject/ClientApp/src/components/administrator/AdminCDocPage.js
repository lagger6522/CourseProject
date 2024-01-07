import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AdminCDocPage.css';

export class AdminCDocPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="button-container">
                <Link to="/administrator/CDocAdd" className="admin-button-link">
                    <button className="admin-button">Добавить главврача</button>
                </Link>
                <Link to="/administrator/CDocAlt" className="admin-button-link">
                    <button className="admin-button">Изменить данные главврача</button>
                </Link>
                <Link to="/administrator/CDocSel" className="admin-button-link">
                    <button className="admin-button">Список главврачей</button>
                </Link>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default AdminCDocPage;