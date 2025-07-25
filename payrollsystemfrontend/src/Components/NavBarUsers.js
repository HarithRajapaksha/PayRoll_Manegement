import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" style={{ backgroundColor: 'red' }}>
          The Karnivore
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/EmployeeHomePage">
                Home
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Leave
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/HolidayRequest">
                    Full Leave Request
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/HalfDayForm">
                    HalfDay Request
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/MidleSalRequest">
                Advance Request
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/AllUsersSalData">
                PaidSheet
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/AdvancePaymentForEmp">
                Advance payment Status
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/UserLeavesStatus">
                Leave Status
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/HalfDayForEmp">
                Half Day Status
              </a>
            </li>
          
          </ul>
          <div className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;