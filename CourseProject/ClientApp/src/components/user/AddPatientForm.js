import React, { useState } from 'react';
import sendRequest from '../SendRequest';

const AddPatientForm = () => {
    const userId = sessionStorage.getItem('userId');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        gender: 'Male', 
        userId,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Используем вашу функцию sendRequest для отправки данных на сервер
        sendRequest('api/Patient/AddPatient', 'POST', formData)
            .then((data) => {
                console.log('Patient added successfully:', data);
                // Дополнительные действия, например, перенаправление пользователя или обновление состояния приложения
            })
            .catch((error) => {
                console.error('Error adding patient:', error);
            });
    };

    return (
        <div>
            <h2>Пациенты</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Имя:
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        pattern="[A-Za-zА-Яа-яЁё]+"
                        title="Данное поле не принимает цифры"
                        required
                    />
                </label>
                <br />
                <label>
                    Фамилия:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        pattern="[A-Za-zА-Яа-яЁё]+"
                        title="Данное поле не принимает цифры"
                        required
                    />
                </label>
                <br />
                <label>
                    Отчество:
                    <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        pattern="[A-Za-zА-Яа-яЁё]+"
                        title="Данное поле не принимает цифры"
                        required
                    />
                </label>
                <br />
                <label>
                    Дата рождения:
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Gender:
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
                <br />
                <button type="submit">Добавить пациента</button>
            </form>
        </div>
    );
};

export default AddPatientForm;
