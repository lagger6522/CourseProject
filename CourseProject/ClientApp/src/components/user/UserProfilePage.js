import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';
import sendRequest from '../SendRequest';

const UserProfilePage = () => {
    const navigate = useNavigate(); // Получаем функцию для навигации

    const handleMyOrdersClick = () => {
        // Переход на страницу заказов
        navigate('/patients-list');
    };
    const user = JSON.parse(sessionStorage.getItem("user"));
    return (
        <div className="user-profile-page">
            <div className="user-profile">
                <h2>Личный кабинет</h2>
                <div>
                    <strong>E-mail:</strong> {user.email}<br/>
                    <strong>Имя:</strong> {user.firstName}<br />
                    <strong>Фамилия:</strong> {user.lastName}<br />
                    <strong>Отчество:</strong> {user.middleName}<br />
                </div>
            </div>
            <div className="user-menu">
                <button onClick={handleMyOrdersClick}>Пациенты</button>
            </div>
        </div>
    );
};

export default UserProfilePage;
