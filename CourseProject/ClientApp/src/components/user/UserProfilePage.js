import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';
import sendRequest from '../SendRequest';

const UserProfilePage = () => {
    const navigate = useNavigate(); // Получаем функцию для навигации

    var email = sessionStorage.getItem("email");

    const handleMyOrdersClick = () => {
        // Переход на страницу заказов
        navigate('/patients-list');
    };

    return (
        <div className="user-profile-page">
            <div className="user-profile">
                <h2>Личный кабинет</h2>
                <div>
                    <strong>E-mail:</strong> {email}
                </div>
            </div>
            <div className="user-menu">
                <button onClick={handleMyOrdersClick}>Пациенты</button>
            </div>
        </div>
    );
};

export default UserProfilePage;
