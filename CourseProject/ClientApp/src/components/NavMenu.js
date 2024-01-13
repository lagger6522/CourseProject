import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import sendRequest from './SendRequest';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
      super(props);
      this.state = { 
          user: null,
          message: ''};
      this.singOut = this.singOut.bind(this);

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

    componentDidMount() {
        if (sessionStorage.getItem("userId") === null) {
            sendRequest("/api/User/Check", "Get", null)
                .then(n => {
                    this.setState({
                        user: n,
                    })
                    sessionStorage.setItem("user", JSON.stringify(n));
                    sessionStorage.setItem("userId", n.userId);
                    sessionStorage.setItem("email", n.email);
                    sessionStorage.setItem("role", n.role);
                    sessionStorage.setItem("isAuthenticated", true);

                    // Проверка роли и перенаправление
                    if (n.role === 'Admin') {
                        window.location.href = "/administrator/AdminPage"
                    }
                    if (n.role === 'Manager') {
                        window.location.href = "/manager/ManagerPage"
                    }
                }).catch(e => { console.error(e); sessionStorage.clear(); })
        }
    }

    singOut() {
        sendRequest("/api/User/singOut", "Post", null)
            .then(n => {
                this.setState({
                    user: null,
                    message: "Вы успешно вышли из аккаунта!"
                })
                window.location.reload();
                sessionStorage.clear();
            }).catch(e => console.error(e))
    }

    render() {
        if (this.state.message) {
            setTimeout(() => {
                this.setState({ message: '' });
            }, 2000);
        }
            let role= sessionStorage.getItem("role") || "User";
        let home = "/";
        if (role === 'User') {
            home = "/"
        } else if (role === 'Admin') {
            home = "/administrator/AdminPage"
        } else if (role === 'Chief Medical Officer') {
            home = "/chief/ChiefPage"
        } else {
            home = "/manager/ManagerPage"
        }
      return (
      <header>
              {this.state.message && (
                  <div className="success-message-container">
                      <p className="success-message">{this.state.message}</p>
                  </div>
              )}
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to={home} >CourseProject</NavbarBrand>
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
