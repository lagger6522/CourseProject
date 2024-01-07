import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ChiefPage.css';

export class ChiefPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="button-container">  
                <Link to="/chief/DoctorList">
                    <button>Список врачей</button>
                </Link>

            </div>
        );
    }
}

export default ChiefPage;
