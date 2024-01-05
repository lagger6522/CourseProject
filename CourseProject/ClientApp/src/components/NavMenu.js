import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">CourseProject</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              {sessionStorage.getItem("userId") !== null ?
                (
                        <div className="auth-buttons">
                            <Link className="text-dark" to="/user/UserProfilePage">
                                <button>Мой профиль</button>
                            </Link>
                            <Link className="text-dark" to="/">
                                <button onClick={this.singOut}>Выход</button>
                            </Link>
                        </div>
                ) : (
                        <div className="auth-buttons">
                            <Link className="text-dark" to="/Authentication/RegisterPage">
                                <button>Регистрация</button>
                            </Link>
                            <Link className="text-dark" to="/Authentication/LoginPage">
                                <button>Войти</button>
                            </Link>
                        </div> 
                )}
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
