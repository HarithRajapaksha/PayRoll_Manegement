import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './ChangebgColour.css'; // Import custom CSS for background color

const EmployeeIDCard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const barcodeRef = useRef(null);
  const idCardRef = useRef(null);
  const { userId } = useParams();

  // Fetch all registered users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          "http://localhost:3006/api/users/AllRegUsersData",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Set users to response.data.users to match API structure
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
        console.log("All Users Data:", response.data.users);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchAllUsers();
  }, []);

  // Fetch selected user data
  useEffect(() => {
    const fetchUserData = async () => {
      const id = selectedUserId || userId;
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          `http://localhost:3006/api/users/admin/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchUserData();
  }, [selectedUserId, userId]);

  // Generate barcode when userData is available
  useEffect(() => {
    if (userData?.FindUser?.barcode && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, userData.FindUser.barcode, {
          format: "EAN13",
          lineColor: "#000",
          displayValue: true,
          fontSize: 16,
          height: 60,
          width: 2,
          margin: 10,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
        setError("Failed to generate barcode");
      }
    }
  }, [userData]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!idCardRef.current || !userData?.FindUser) {
      setError("No ID card data available to download");
      return;
    }

    try {
      const canvas = await html2canvas(idCardRef.current, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");

      const width = 85 * 3.779528; // 85mm to pixels
      const height = 54 * 3.779528; // 54mm to pixels

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${userData.FindUser.userName}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF");
    }
  };

  // Handle dropdown change
  const handleUserSelect = (event) => {
    setSelectedUserId(event.target.value);
    setUserData(null); // Reset user data when new user is selected
    setError(null); // Clear any previous errors
  };

  return (
    <div className="page-bg">
    <div className="container mt-5">
      <h2 className="text-center mb-4">Employee ID Cards</h2>

      {/* Dropdown for selecting employee */}
      <div className="mb-4">
        <label htmlFor="userSelect" className="form-label fw-bold">
          Select Employee
        </label>
        <select
          id="userSelect"
          className="form-select"
          value={selectedUserId}
          onChange={handleUserSelect}
        >
          <option value="">Select an employee</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.CorrectuserId} value={user.CorrectuserId}>
                {user.userName}-{user.CorrectuserId || "N/A"}
              </option>
            ))
          ) : (
            <option disabled>No employees available</option>
          )}
        </select>
      </div>

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ID Card Display */}
      {userData?.FindUser ? (
        <div className="d-flex flex-column align-items-center">
          <div
            ref={idCardRef}
            className="card shadow-sm"
            style={{ width: "650px", height: "400px", backgroundColor: "#f9f9f9" }}
          >
            <div className="card-body d-flex flex-column justify-content-between align-items-center">
              {/* Profile Image */}
              <img
                src="https://via.placeholder.com/80"
                alt="User Avatar"
                className="rounded-circle mt-3"
                style={{ width: "80px", height: "80px" }}
              />

              {/* User Information */}
              <div className="w-100">
                <h4 className="card-title mb-3">
                  <strong>Employee Name:</strong> {userData.FindUser.userName}
                </h4>
                <h4 className="card-title mb-3">
                  <strong>Employee Role:</strong> {userData.FindUser.role}
                </h4>
                <h4 className="card-title mb-3">
                  <strong>Emp ID:</strong> EMP {userData.FindUser.CorrectuserId}
                </h4>
              </div>

              {/* Barcode */}
              <div className="mt-3">
                <svg ref={barcodeRef}></svg>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary mt-3"
            disabled={!userData}
          >
            Download ID Card as PDF
          </button>
        </div>
      ) : selectedUserId ? (
        <p className="text-center">Loading...</p>
      ) : (
        <p className="text-center">Please select an employee to view ID card.</p>
      )}
    </div>
    </div>
  );
};

export default EmployeeIDCard;