import React, { Component } from 'react';
import './AdminPage.css';
import sendRequest from '../SendRequest';

export class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }


    render() {
        return (
            <div class="button-container">
                <button class="button">Кнопка 1</button>
                <button class="button">Кнопка 2</button>
            </div>
        );
    }
}

export default AdminPage;
