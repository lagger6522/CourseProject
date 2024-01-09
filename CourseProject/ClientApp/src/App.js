import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import AddPatientForm from './components/user/AddPatientForm';
import PatientList from './components/user/PatientList';
import EditPatientForm from './components/user/EditPatientForm';
import HospitalsListPage from './components/user/HospitalsListPage';
import SpecList from './components/user/SpecList';
import DocTalon from './components/user/DocTalon';
import EditSchedulePage from './components/chief/EditSchedulePage';
import './custom.css';

export default class App extends Component {
    static displayName = App.name;

  render() {
    return (
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
          })}
          <Route path="/patients" element={<AddPatientForm />} />
          <Route path="/patients-list" element={<PatientList />} />
          <Route path="/schedule/edit" element={<EditSchedulePage />} />     
          <Route path="/edit-patient" element={<EditPatientForm />} />     
          <Route path="/appointment" element={<HospitalsListPage />} />     
          <Route path="/spec" element={<SpecList />} />     
          <Route path="/doctor-details" element={<DocTalon />} />     
                
        </Routes>
      </Layout>
    );
  }
}
