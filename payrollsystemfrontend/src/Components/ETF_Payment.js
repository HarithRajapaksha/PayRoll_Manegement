import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function ETF_Payment() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    year: new Date().getFullYear().toString()
  });
  const [loading, setLoading] = useState(false);
  const [etfAmount, setEtfAmount] = useState(0);
  const [showEmployeeCard, setShowEmployeeCard] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/users/allUsersData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch employees');

      const data = await response.json();
      setEmployees(data.FindUser);
    } catch (error) {
      console.error('Error loading employees:', error);
      Swal.fire('Error', 'Failed to load employee data.', 'error');
    }
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    const employee = employees.find(
      emp => emp._id === employeeId && emp.empType?.toLowerCase() === 'permanent'
    );
    setFormData({ ...formData, employeeId });
    setSelectedEmployee(employee);

    if (employee) {
      const calculatedETF = parseFloat(employee.basicSal || 0) * 0.03;
      setEtfAmount(calculatedETF);
      setShowEmployeeCard(true);
    } else {
      setEtfAmount(0);
      setShowEmployeeCard(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !formData.month || !formData.year) {
      Swal.fire('Missing Fields', 'Please complete the form before submitting.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        userId: selectedEmployee._id,
        Month: formData.month,
        Year: formData.year,
        EMPID: selectedEmployee.CorrectuserId,
        Value: etfAmount.toFixed(2)
      };

      const response = await fetch('http://localhost:3006/api/etf/AddETF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment failed');
      }

      Swal.fire('Success', 'ETF Payment successfully processed.', 'success');
      resetForm();
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      month: '',
      year: new Date().getFullYear().toString()
    });
    setSelectedEmployee(null);
    setEtfAmount(0);
    setShowEmployeeCard(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold text-primary">ETF Payment Portal</h2>

      <div className="card shadow-lg p-4 mb-4">
        <div className="mb-3">
          <label className="form-label">Select Permanent Employee</label>
          <select
            className="form-select"
            value={formData.employeeId}
            onChange={handleEmployeeChange}
          >
            <option value="">-- Choose Employee --</option>
            {employees
              .filter(emp => emp.empType?.toLowerCase() === 'permanent')
              .map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.CorrectuserId || 'N/A'}) - {emp.role}
                </option>
              ))}
          </select>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Month</label>
            <select
              className="form-select"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
            >
              <option value="">-- Select Month --</option>
              {monthNames.map((month, index) => (
                <option key={index} value={String(index + 1).padStart(2, '0')}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Year</label>
            <select
              className="form-select"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
            >
              <option value="">-- Select Year --</option>
              {generateYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className={`btn ${loading ? 'btn-secondary' : 'btn-primary'} w-100`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit ETF Payment'}
        </button>
      </div>

      {showEmployeeCard && selectedEmployee && (
        <div className="card bg-light border-success p-4">
          <h4 className="text-success mb-3">Employee Summary</h4>
          <p><strong>Name:</strong> {selectedEmployee.name}</p>
          <p><strong>Employee ID:</strong> {selectedEmployee.CorrectuserId || 'N/A'}</p>
          <p><strong>Role:</strong> {selectedEmployee.role}</p>
          <p><strong>Basic Salary:</strong> Rs. {parseFloat(selectedEmployee.basicSal || 0).toLocaleString()}</p>
          <p className="fw-bold mt-3 fs-5 text-success">
            ETF Value (3%): Rs. {etfAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default ETF_Payment;
