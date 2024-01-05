import React, { Component } from 'react';
import './AdminPolyPage.css';

export class AdminPolyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }


    render() {
        return (
            <div class="column-container">
                <button class="button">Добавить поликлинику</button>
                <button class="button">Изменить данные о поликлинике</button>
                <button class="button">Удалить поликлинику</button>
                <button class="button">Список поликлиник</button>
                <button className="admin-corner-button">&#8606;</button>
            </div>

        );
    }
}

export default AdminPolyPage;
