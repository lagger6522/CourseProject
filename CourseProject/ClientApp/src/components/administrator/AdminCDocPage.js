import React, { Component } from 'react';
import './AdminCDocPage.css';

export class AdminCDocPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="column-container">
                <button className="button">Добавить главврача</button>
                <button className="button">Изменить данные главврача</button>
                <button className="button">Удалить главврача</button>
                <button className="button">Список главврачей</button>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default AdminCDocPage;