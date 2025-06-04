import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import EmployeeRegister from './Components/EmployeeRegister';
import UserId from "./Components/UserId";
import EmpHolidayRequest from "./Components/EmpHolidayRequest";
import MonthlyMidSalary from "./Components/MonthlyMiddleSal";
import HolidayRequestForm from "./Components/AdminHolidayRequestHandle";
import MidleSal from "./Components/MonthlyMiddleSal";
import MidleSalRequest from "./Components/EmpMiddleSalRequest";
import EpfApplication from "./Components/EPFApplicationForm";
import BacodeData from "./Components/BarcodeAttendence";
import HalfDayForm from "./Components/HalfDayForm";
import HighestAndLowestdata from "./Components/HighestAndLowestData";
import ReportLeaveDataShow from "./Components/ReportLeaveDataShow";
import HalfDayComparision from "./Components/HalfDayComparision";
import NotApprovedHalfDayComparision from "./Components/NotApprovedHalfDayComparision";
import LeaveNotAproved from "./Components/LeavesNotAproved";
import AdvancePayment from "./Components/AdvancePayment";
import HalfDayRequests from "./Components/HalfDayRequest";
import AllUsersSallaryHandle from "./Components/AllUsersSallaryHandle";
import NavigationBar from "./Components/NavBarAdmin.js";
import NavBarUsers from "./Components/NavBarUsers.js";
import NavBarAdmin from "./Components/NavBarAdmin.js";
import AllUsersSalData from "./Components/GetTheAllUsersSalData.js";
import AdminAllUsersSalData from "./Components/AdminGetAllUsersPaySlips.js";
import UserManagement from "./Components/UserManagement.js";

import { jwtDecode } from "jwt-decode";

// Navbar component that shows the correct navbar based on login status and user role
function AppNavbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const token = localStorage.getItem('token');
  let userRole = null;

  try {
    if (token) {
      userRole = jwtDecode(token);
      console.log('User Role:', userRole.role);
    }
  } catch (error) {
    console.error('Invalid token:', error);
  }

  return (
    <>
      {!isLoginPage && userRole && (
        userRole.role === 'Admin' ? <NavBarAdmin /> : <NavBarUsers />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="EmpRegister/" element={<EmployeeRegister />} />
        <Route path="/UserId/:userId" element={<UserId />} />
        <Route path="/HolidayRequest" element={<EmpHolidayRequest />} />
        <Route path="/MonthlyMidSalary" element={<MonthlyMidSalary />} />
        <Route path="/HolidayHandle-Admin" element={<HolidayRequestForm />} />
        <Route path="/MidleSalary" element={<MidleSal />} />
        <Route path="/MidleSalRequest" element={<MidleSalRequest />} />
        <Route path="/EpfApplication" element={<EpfApplication />} />
        <Route path="/BarcodeData" element={<BacodeData />} />
        <Route path="/HalfDayForm" element={<HalfDayForm />} />
        <Route path="/HighestAndLowestdata" element={<HighestAndLowestdata />} />
        <Route path="/ReportLeaveDataShow" element={<ReportLeaveDataShow />} />
        <Route path="/HalfDayComparision" element={<HalfDayComparision />} />
        <Route path="/NotApprovedHalfDayComparision" element={<NotApprovedHalfDayComparision />} />
        <Route path="/LeaveNotAproved" element={<LeaveNotAproved />} />
        <Route path="/AdvancePayment" element={<AdvancePayment />} />
        <Route path="/HalfDayRequests" element={<HalfDayRequests />} />
        <Route path="/AllUsersSallaryHandle" element={<AllUsersSallaryHandle />} />
        <Route path="/NavBar" element={<NavigationBar />} />
        <Route path="/AllUsersSalData" element={<AllUsersSalData />} />
        <Route path="/AdminAllUsersSalData" element={<AdminAllUsersSalData />} />
        <Route path="/UserManagement" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;