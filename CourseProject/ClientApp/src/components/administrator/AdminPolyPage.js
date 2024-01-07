import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AdminPolyPage.css';

export class AdminPolyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }


    render() {
        return (
            <div className="button-container">
                <Link to="/administrator/PolyAdd" className="admin-button-link">
                    <button className="admin-button">Добавить поликлинику</button>
                </Link>
                <Link to="/administrator/PolyAlt" className="admin-button-link">
                    <button className="admin-button">Изменить данные поликлиники</button>
                </Link>
                <Link to="/administrator/PolyList" className="admin-button-link">
                    <button className="admin-button">Список поликлиник</button>
                </Link>
                <button className="admin-corner-button">&#8606;</button>
            </div>

        );
    }
}

export default AdminPolyPage;