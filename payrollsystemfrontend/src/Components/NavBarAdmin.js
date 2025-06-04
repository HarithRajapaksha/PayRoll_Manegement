import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark shadow-lg px-4 py-3 rounded-bottom">
      <div className="container-fluid">
        <a className="navbar-brand fs-3 fw-bold text-danger" href="#">
          🥩 The Karnivore
        </a>
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto gap-3">
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="#">🏠 Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/HolidayHandle-Admin">📅 Full Leave</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/EmpRegister">👤 Employee Registration</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/MonthlyMidSalary">⏳ Halfday Request</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/AdvancePayment">💸 Advance Payment</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/UserManagement">🛠 Edit Details</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/HalfDayRequests">🕒 Half Day</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/BarcodeData">📍 Attendance</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/AllUsersSallaryHandle">💼 Allowances</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-semibold" href="/EpfApplication">📑 EPF/ETF</a>
            </li>

            {/* Requests Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-white fw-semibold"
                href="#"
                id="requestsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                📝 Requests
              </a>
              <ul className="dropdown-menu dropdown-menu-dark border-0 shadow">
                <li><a className="dropdown-item" href="/HolidayRequest">📅 Full Leave Request</a></li>
                <li><a className="dropdown-item" href="/HalfDayForm">🕒 HalfDay Request</a></li>
              </ul>
            </li>

            {/* Reports Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-white fw-semibold"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                📊 Reports
              </a>
              <ul className="dropdown-menu dropdown-menu-dark border-0 shadow">
                <li><a className="dropdown-item" href="/HighestAndLowestdata">📈 Attendance Summary</a></li>
                <li><a className="dropdown-item" href="/ReportLeaveDataShow">✔️ Approved Leave</a></li>
                <li><a className="dropdown-item" href="/LeaveNotAproved">❌ Unapproved Leave</a></li>
                <li><a className="dropdown-item" href="/HalfDayComparision">🕒 Approved Half Day</a></li>
                <li><a className="dropdown-item" href="/NotApprovedHalfDayComparision">🕤 Unapproved Half Day</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">📊 Advance Report</a></li>
                <li><a className="dropdown-item" href="#">📁 EPF Report</a></li>
                <li><a className="dropdown-item" href="#">📁 ETF Report</a></li>
                <li><a className="dropdown-item" href="/AdminAllUsersSalData">📃 Monthly Payslips</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
