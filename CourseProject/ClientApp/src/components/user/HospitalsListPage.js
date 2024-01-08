import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import sendRequest from '../SendRequest';

export class HospitalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hospitals: [],
            sortedField: null,
            sortOrder: 'asc',
            searchQuery: '',
            filterType: 'All',
        };
    }

    componentDidMount() {
        this.loadHospitals();
    }

    loadHospitals = () => {
        sendRequest('/api/Hospital/GetHospitals', 'GET')
            .then((data) => {
                this.setState({ hospitals: data });
            })
            .catch((error) => {
                console.error('Error fetching hospital list:', error);
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
        this.setState({ filterType: event.target.value });
    };

    render() {
        const { hospitals, sortedField, sortOrder, searchQuery, filterType } = this.state;

        // Сортировка
        const sortedHospitals = [...hospitals].sort((a, b) => {
            const order = sortOrder === 'asc' ? 1 : -1;
            return a[sortedField] > b[sortedField] ? order : -order;
        });

        // Поиск
        const filteredHospitals = sortedHospitals.filter((hospital) => {
            const searchFields = ['clinicName', 'city', 'street', 'houseNumber', 'registrationNumber', 'clinicType'];
            return searchFields.some((field) => hospital[field].toLowerCase().includes(searchQuery.toLowerCase()));
        });

        // Фильтрация
        const finalHospitals = filterType === 'All' ? filteredHospitals : filteredHospitals.filter((hospital) => hospital.clinicType.toLowerCase() === filterType.toLowerCase());

        return (
            <div>
                <h2>Hospital List</h2>
                <div>
                    <label>
                        Search:
                        <input type="text" value={searchQuery} onChange={this.handleSearch} />
                    </label>
                    <label>
                        Filter by Type:
                        <select value={filterType} onChange={this.handleFilter}>
                            <option value="All">All</option>
                            <option value="Adult">Adult</option>
                            <option value="Pediatric">Pediatric</option>
                            <option value="Specialized">Specialized</option>
                        </select>
                    </label>
                </div>
                <div className="hospital-list">
                    {finalHospitals.map((hospital) => (
                        <Link key={hospital.hospitalId} to={`/hospital/${hospital.hospitalId}`}>
                            <div className="hospital-block">
                                <h3>{hospital.clinicName}</h3>
                                <p>City: {hospital.city}</p>
                                <p>Street: {hospital.street}</p>
                                <p>House Number: {hospital.houseNumber}</p>
                                <p>Registration Number: {hospital.registrationNumber}</p>
                                <p>Clinic Type: {hospital.clinicType}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

export default HospitalList;