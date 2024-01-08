import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import AddPatientForm from './components/user/AddPatientForm';
import PatientList from './components/user/PatientList';
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

        </Routes>
      </Layout>
    );
  }
}
