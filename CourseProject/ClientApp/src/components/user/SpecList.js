import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from '../SendRequest';

export class SpecList extends Component {
    constructor(props) {
        super(props);
        const queryParameters = new URLSearchParams(window.location.search);
        this.state = {
            doctors: [],
            hospitalId: queryParameters.get("hospitalId"),
            searchQuery: '',
            sortedField: null,
            sortOrder: 'asc',
            filterSpecialization: 'All',
        };
    }

    componentDidMount() {
        this.loadDoctors();
    }

    loadDoctors = () => {
        const { hospitalId } = this.state;
        sendRequest(`/api/User/GetDoctorsByHospital`, 'GET', null, { hospitalId })
            .then((data) => {
                this.setState({ doctors: data });
            })
            .catch((error) => {
                console.error('Error fetching doctor list:', error);
            });
    };

    handleSort = (field) => {
        const { sortedField, sortOrder } = this.state;

        if (sortedField === field) {
            this.setState({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
        } else {
            this.setState({ sortedField: field, sortOrder: 'asc' });
        }
    };

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    handleFilter = (event) => {
        this.setState({ filterSpecialization: event.target.value });
    };

    render() {
        const { doctors, hospitalId, searchQuery, sortedField, sortOrder, filterSpecialization } = this.state;

        // Поиск
        const filteredDoctors = doctors.filter((doctor) =>
            doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Сортировка
        const sortedDoctors = [...filteredDoctors].sort((a, b) => {
            const order = sortOrder === 'asc' ? 1 : -1;
            return a[sortedField] > b[sortedField] ? order : -order;
        });

        // Фильтрация по специализации
        const finalDoctors = filterSpecialization === 'All'
            ? sortedDoctors
            : sortedDoctors.filter((doctor) => doctor.specialization.toLowerCase() === filterSpecialization.toLowerCase());

        return (
            <div>
                <h2>Список врачей</h2>
                <div>
                    <label>
                        Поиск:
                        <input type="text" value={searchQuery} onChange={this.handleSearch} />
                    </label>
                    <label>
                        Фильтрация:
                        <select value={filterSpecialization} onChange={this.handleFilter}>
                            <option value="All">All</option>
                            <option value="Дерматолог">Дерматолог</option>
                            <option value="Терапевт">Терапевт</option>
                            {/* Добавьте ваши варианты специализации в элементы <option> */}
                        </select>
                    </label>
                </div>
                <ul>
                    {finalDoctors.map((doctor) => (
                        <li key={doctor.userId}>
                            <Link to={`/doctor-details?userId=${doctor.userId}`}>
                                <div>
                                    <p>Name: {doctor.firstName} {doctor.lastName}</p>
                                    <p>Specialization: {doctor.specialization}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default SpecList;
