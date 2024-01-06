import React, { Component } from 'react';
import './DelPolyPage.css';

export class DelPolyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="form-container">
                <h2>Удаление поликлиники</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="clinicName">Наименование клиники</label>
                        <input type="text" id="clinicName" name="clinicName" required />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Удалить" style={{ width: '100%' }} />
                    </div>
                </form>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default DelPolyPage;