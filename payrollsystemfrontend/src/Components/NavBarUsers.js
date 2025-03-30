import React from 'react';
import { Button } from 'react-bootstrap'; // Import Bootstrap's Button component
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Import Bootstrap JS (includes Popper.js for dropdown functionality)


function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#"  style={{backgroundColor:'red'}}>The Karnivore</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Leave 
              </a>

              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="/HolidayRequest">Full Leave Request</a></li>
                <li><a className="dropdown-item" href="/HalfDayForm">HalfDay Request</a></li>
              </ul>
            </li>
      
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/MidleSalRequest">Advance Request</a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/AllUsersSalData">PaidSheet</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Contact Us</a>
            </li>
          
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
