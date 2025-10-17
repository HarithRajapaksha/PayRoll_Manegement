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
import AllowancesHandle from "./Components/AllowancesHandle.js";
import NavigationBar from "./Components/NavBarAdmin.js";
import NavBarUsers from "./Components/NavBarUsers.js";
import NavBarAdmin from "./Components/NavBarAdmin.js";
import AllUsersSalData from "./Components/GetTheAllUsersSalData.js";
import AdminAllUsersSalData from "./Components/AdminGetAllUsersPaySlips.js";
import UserManagement from "./Components/UserManagement.js";
import ServiceChargeHandle from "./Components/ServiceChargeHandle.js";
import ETF_Payment from "./Components/ETF_Payment.js";
import EpfPayment from "./Components/EpfPayment.js";
import AllEmployeesIdData from "./Components/AllemployeesIdData.js";
import EmployeeHomePage from "./Components/EmployeeHomePage.js";
import EpfPaymnetsDes from "./Components/EpfPaymnetsDes.js";
import EtfPaymentsDes from "./Components/ETFPaymentDes.js";
import AllNetSalary from "./Components/AllNetSalary.js";
import LeaveSummery from "./Components/LeaveSummery.js";
import AdancePaymentReport from "./Components/AdancePaymentReport.js";
import AttendanceReport from "./Components/AttendenceReport.js";
import AdvancePaymentForEmp from "./Components/AdvancePaymentForEmp.js";
import UserLeavesStatus from "./Components/UserLeavesStatus.js";
import HalfDayForEmp from "./Components/HalfDayForEmp.js";
import ManualAttendence from "./Components/ManualAttendence.js";

import { jwtDecode } from "jwt-decode";

// Navbar component that shows the correct navbar based on login status and user role
function AppNavbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const token = localStorage.getItem('token');
  let userRole = null;
  console.log('Token:', token);

  try {
    if (token) {
      userRole = jwtDecode(token);
      console.log('User Role:', userRole);
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
        <Route path="/AllowanceHandle" element={<AllowancesHandle />} />
        <Route path="/NavBar" element={<NavigationBar />} />
        <Route path="/AllUsersSalData" element={<AllUsersSalData />} />
        <Route path="/AdminAllUsersSalData" element={<AdminAllUsersSalData />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/ServiceChargeHandle" element={<ServiceChargeHandle />} />
        <Route path="/ETF_Payment" element={<ETF_Payment />} />
        <Route path="/EpfPayment" element={<EpfPayment />} />
        <Route path="/AllEmployeesIdData" element={<AllEmployeesIdData />} />
        <Route path="/EmployeeHomePage" element={<EmployeeHomePage />} />
        <Route path="/EpfPaymnetsDes" element={<EpfPaymnetsDes />} />
        <Route path="/ETFPaymentsDes" element={<EtfPaymentsDes />} />
        <Route path="/AllNetSalary" element={<AllNetSalary />} />
        <Route path="/LeaveSummery" element={<LeaveSummery />} />
        <Route path="/AdancePaymentReport" element={<AdancePaymentReport />} />
        <Route path="/AttendanceReport" element={<AttendanceReport />} />
        <Route path="/AdvancePaymentForEmp" element={<AdvancePaymentForEmp />} />
        <Route path="/UserLeavesStatus" element={<UserLeavesStatus />} />
        <Route path="/HalfDayForEmp" element={<HalfDayForEmp />} />
        <Route path="/ManualAttendence" element={<ManualAttendence />} />
        
      </Routes>
    </Router>
  );
}

export default App;