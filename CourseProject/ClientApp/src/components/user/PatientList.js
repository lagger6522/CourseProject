import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Добавлен Link
import sendRequest from '../SendRequest';

const PatientList = () => {
    const userId = sessionStorage.getItem('userId');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Запрос на сервер для получения списка пациентов пользователя
        sendRequest(`api/Patient/GetPatientsByUser?userId=${userId}`, 'GET')
            .then((data) => {
                setPatients(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching patient list:', error);
                setLoading(false);
            });
    }, [userId]);

    return (
        <div>
            <h2>Список пациентов</h2>
            {loading ? (
                <p>Загрузка...</p>
            ) : patients.length === 0 ? (
                <p>У вас пока нет пациентов.</p>
            ) : (
                <ul>
                    {patients.map((patient) => (
                        <li key={patient.patientId}>
                            Имя: {patient.firstName}<br />
                            Фамилия: {patient.lastName}<br />
                            Дата рождения: {new Date(patient.birthDate).toLocaleDateString()}<br />
                            Пол: {patient.gender}
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/patients">
                <button>Добавить пациента</button>
            </Link>
        </div>
    );
};

export default PatientList;
