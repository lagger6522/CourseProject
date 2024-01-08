import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from '../SendRequest';

const PatientList = () => {
    const userId = sessionStorage.getItem('userId');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const handleDelete = (patientId) => {
        sendRequest(`/api/Patient/DeletePatient`, 'DELETE', null, { patientId })
            .then(() => {
                console.log(`Пациент с ID ${patientId} успешно удален.`);
                setPatients((prevPatients) => prevPatients.filter((patient) => patient.patientId !== patientId));
            })
            .catch((error) => {
                console.error(`Ошибка при удалении пациента с ID ${patientId}:`, error);
            });
    };



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
                            Отчество: {patient.middleName}<br />
                            Дата рождения: {new Date(patient.birthDate).toLocaleDateString()}<br />
                            Пол: {patient.gender}<br />
                            <Link to={`/edit-patient?patientId=${patient.patientId}`}>
                                <button>Изменить</button>
                            </Link>                             
                            <button onClick={() => handleDelete(patient.patientId)}>Удалить</button>
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
