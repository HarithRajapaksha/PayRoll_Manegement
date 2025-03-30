import React from 'react';
import { Button } from 'react-bootstrap'; // Import Bootstrap's Button component
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Import Bootstrap JS (includes Popper.js for dropdown functionality)


function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" style={{backgroundColor:'red'}}>The karnivore</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/HolidayHandle-Admin">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/AdvancePayment">Advance payment</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="EmpRegister/">Employee Registration</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/HalfDayRequests">HalfDay Handle</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/BarcodeData">Attendence</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/AllUsersSallaryHandle">Allowances & Service Charge</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/EpfApplication">EPF/ETF Application</a>
            </li>

            {/* Dropdown Menu */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Reports
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="/HighestAndLowestdata">Attendance Summary</a></li>
                <li><a className="dropdown-item" href="/ReportLeaveDataShow">Aproved Leave</a></li>
                <li><a className="dropdown-item" href="/LeaveNotAproved">Non Aproved Leave</a></li>
                <li><a className="dropdown-item" href="/HalfDayComparision">Aprooved Half Day</a></li>
                <li><a className="dropdown-item" href="/NotApprovedHalfDayComparision">Non Aproved Half Day</a></li>
                <li><a className="dropdown-item" href="">Advance Report</a></li>
                <li><a className="dropdown-item" href="#">EPF report</a></li>
                <li><a className="dropdown-item" href="#">ETF report</a></li>
                <li><a className="dropdown-item" href="/AdminAllUsersSalData">Overall paysheet</a></li>

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
