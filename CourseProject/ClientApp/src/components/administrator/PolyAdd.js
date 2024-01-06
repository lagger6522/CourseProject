import React, { Component } from 'react';
import './PolyAdd.css';

export class PolyAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="form-container">
                <h2>Форма для заполнения данных клиники</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="clinicName">Наименование клиники</label>
                        <input type="text" id="clinicName" name="clinicName" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressCity">Город</label>
                        <input type="text" id="addressCity" name="addressCity" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressStreet">Улица</label>
                        <input type="text" id="addressStreet" name="addressStreet" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addressHouse">Дом</label>
                        <input type="text" id="addressHouse" name="addressHouse" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="registrationNumber">Номер регистратуры</label>
                        <input type="text" id="registrationNumber" name="registrationNumber" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="schedule">Время работы</label>
                        <textarea id="schedule" name="schedule" rows="4" required></textarea>
                    </div>
                    <div className="form-group">
                        <label>Тип клиники</label>
                        <div>
                            <label htmlFor="typeAdult">
                                <input type="radio" id="typeAdult" name="type" value="adult" required /> Взрослая
                            </label>
                        </div>
                        <div>
                            <label htmlFor="typeChild">
                                <input type="radio" id="typeChild" name="type" value="child" required /> Детская
                            </label>
                        </div>
                        <div>
                            <label htmlFor="typeSpecialized">
                                <input type="radio" id="typeSpecialized" name="type" value="specialized" required /> Специализированная
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Добавить" style={{ width: '100%' }} />
                    </div>
                </form>
                <button className="admin-corner-button">&#8606;</button>
            </div>
        );
    }
}

export default PolyAdd;