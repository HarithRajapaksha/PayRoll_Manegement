import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';

function AttendanceReport() {
  const { userId: initialUserId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || '');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('07');
  const tableRef = useRef(null);

  const token = localStorage.getItem('token');

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2000 + 2 }, (_, i) =>
    (2000 + i).toString(),
  );

  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3006/api/users/AllRegUsersData', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: HTTP ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('All Users Data:', result);
        if (result.users && Array.isArray(result.users)) {
          setUsers(result.users);
          if (initialUserId) {
            const user = result.users.find((u) => u._id === initialUserId);
            if (user) {
              setSelectedUserId(initialUserId);
            } else {
              console.warn(`User with _id ${initialUserId} not found in users data`);
            }
          }
        } else {
          throw new Error('No users data found in API response');
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch Users Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, initialUserId]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!selectedUserId) {
        setAttendanceData([]);
        return;
      }

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3006/api/users/attendance/${year}/${month}/${selectedUserId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch attendance: HTTP ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Attendance Data:', result);
        if (result.success) {
          setAttendanceData(result.data || []);
        } else {
          throw new Error(result.message || 'API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch Attendance Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [year, month, selectedUserId, token]);

  const formatDateTime = (dateString) => {
    if (!dateString) return { createdDate: 'N/A', createdTime: 'N/A' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { createdDate: 'Invalid Date', createdTime: 'Invalid Time' };
    const createdDate = date.toISOString().split('T')[0];
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const createdTime = `${hours12}:${minutes}:${seconds} ${ampm}`;
    return { createdDate, createdTime };
  };

  const generatePDF = async () => {
    const table = tableRef.current;
    if (!table) {
      setError('Table reference not found. Cannot generate PDF.');
      return;
    }

    try {
      const canvas = await html2canvas(table, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add headers
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('The Karnivore Restaurant', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('No 263, Nawala Rd, Sri Jayawardenapura Kotte', 105, 25, { align: 'center' });
      pdf.text('Tel: 0113517277', 105, 33, { align: 'center' });
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        `${monthOptions.find((m) => m.value === month)?.label || 'N/A'} ${year}`,
        105,
        43,
        { align: 'center' }
      );
      pdf.setFontSize(12);
      pdf.text('Attendance Report', 105, 50, { align: 'center' });

      // Add table image below headers
      let heightLeft = imgHeight;
      let position = 55;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 55;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 55;
        pdf.addPage();
        // Repeat headers on new pages
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('The Karnivore Restaurant', 105, 15, { align: 'center' });
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('No 263, Nawala Rd, Sri Jayawardenapura Kotte', 105, 25, { align: 'center' });
        pdf.text('Tel: 0113517277', 105, 33, { align: 'center' });
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(
          `${monthOptions.find((m) => m.value === month)?.label || 'N/A'} ${year}`,
          105,
          43,
          { align: 'center' }
        );
        pdf.setFontSize(12);
        pdf.text('Attendance Report', 105, 50, { align: 'center' });
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 55;
      }

      pdf.save(`AttendanceReport_${year}_${month}_${selectedUserId || 'unknown'}.pdf`);
    } catch (err) {
      setError('Failed to generate PDF: ' + err.message);
      console.error('PDF Generation Error:', err);
    }
  };

  return (
    <div className="container mt-4">
      {/* Report Header */}
      <h2 className="mb-2 text-center">The Karnivore Restaurant</h2>
      <h3 className="mb-2 text-center">
        {monthOptions.find((m) => m.value === month)?.label || 'N/A'} {year}
      </h3>
      <h4 className="mb-4 text-center">Attendance Report</h4>

      {/* User, Year, and Month Selection */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="userSelect" className="form-label">
            Select User
          </label>
          <select
            id="userSelect"
            className="form-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.userName})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="yearSelect" className="form-label">
            Select Year
          </label>
          <select
            id="yearSelect"
            className="form-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={loading}
          >
            {yearOptions.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="monthSelect" className="form-label">
            Select Month
          </label>
          <select
            id="monthSelect"
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={loading}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading data...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Report Preview */}
      <h5 className="mb-3">
        Report Preview (
        {monthOptions.find((m) => m.value === month)?.label || 'N/A'} {year}
        )
      </h5>

      {/* Bootstrap Table */}
      <div ref={tableRef}>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((item, index) => {
                const { createdDate, createdTime } = formatDateTime(item.createdAt);
                return (
                  <tr key={item._id || index}>
                    <td>{item.CorrectuserId || 'N/A'}</td>
                    <td>{item.name || 'N/A'}</td>
                   <td>
                   {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                 month: 'long',
                day: 'numeric',
                  })}
                 </td>
                    <td>{createdTime}</td>
                    <td>{item.outTime || 'N/A'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {selectedUserId ? 'No attendance data available' : 'Please select a user'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Download PDF Button */}
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={generatePDF}
          disabled={!attendanceData.length || loading}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default AttendanceReport;