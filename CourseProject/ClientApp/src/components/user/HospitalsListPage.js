import React, { Component } from 'react';
import sendRequest from '../SendRequest';

export class HospitalList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hospitals: [],
            sortedField: null,
            sortOrder: 'asc',
            searchTerm: '',
            filterType: 'All',
        };
    }

    componentDidMount() {
        this.loadHospitals();
    }

    loadHospitals = () => {
        const { sortedField, sortOrder, searchTerm, filterType } = this.state;

        const queryParams = new URLSearchParams();
        queryParams.append('sortedField', sortedField);
        queryParams.append('sortOrder', sortOrder);
        queryParams.append('searchTerm', searchTerm);
        queryParams.append('filterType', filterType);

        sendRequest(`/api/Hospitals/GetHospitals?${queryParams.toString()}`, 'GET')
            .then((data) => {
                this.setState({ hospitals: data });
            })
            .catch((error) => {
                console.error('Error fetching hospitals:', error);
            });
    };

    handleSort = (field) => {
        const { sortedField, sortOrder } = this.state;
        const newSortOrder = sortedField === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

        this.setState({ sortedField: field, sortOrder: newSortOrder }, () => {
            this.loadHospitals();
        });
    };

    handleSearch = (event) => {
        this.setState({ searchTerm: event.target.value }, () => {
            this.loadHospitals();
        });
    };

    handleFilter = (event) => {
        this.setState({ filterType: event.target.value }, () => {
            this.loadHospitals();
        });
    };

    render() {
        const { hospitals, sortedField, sortOrder, searchTerm, filterType } = this.state;

        return (
            <div>
                <h2>Hospital List</h2>
                <div>
                    <label>
                        Search:
                        <input type="text" value={searchTerm} onChange={this.handleSearch} />
                    </label>
                </div>
                <div>
                    <label>
                        Sort by:
                        <select value={sortedField} onChange={(e) => this.handleSort(e.target.value)}>
                            <option value="ClinicName">Clinic Name</option>
                            <option value="City">City</option>
                            <option value="RegistrationNumber">Registration Number</option>
                            {/* Добавьте дополнительные опции для других полей */}
                        </select>
                    </label>
                    <label>
                        Order:
                        <select value={sortOrder} onChange={(e) => this.setState({ sortOrder: e.target.value }, this.loadHospitals)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Filter by Clinic Type:
                        <select value={filterType} onChange={this.handleFilter}>
                            <option value="All">All</option>
                            <option value="Adult">Adult</option>
                            <option value="Pediatric">Pediatric</option>
                            <option value="Specialized">Specialized</option>
                        </select>
                    </label>
                </div>
                <ul>
                    {hospitals.map((hospital) => (
                        <li key={hospital.HospitalID}>
                            <strong>{hospital.ClinicName}</strong>
                            <p>{hospital.City}, {hospital.Street} {hospital.HouseNumber}</p>
                            <p>Registration Number: {hospital.RegistrationNumber}</p>
                            <p>Working Hours: {hospital.WorkingHours}</p>
                            <p>Clinic Type: {hospital.ClinicType}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default HospitalList;
