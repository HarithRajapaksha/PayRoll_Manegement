import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BarcodeAttendance = () => {
  const [barcode, setBarcode] = useState("");
  const [user, setUser] = useState(null);
  const [scanTime, setScanTime] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const token = localStorage.getItem("token");

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (barcode.length === 13) {
        const trimmed = barcode.slice(0, -1);
        try {
          const response = await axios.get(
            `http://localhost:3006/api/users/getUser/${trimmed}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const foundUser = response.data.FindUser;

          if (!foundUser) {
            console.error("❌ No user found with this barcode");
            return;
          }

          setUser(foundUser);
          setScanTime(new Date().toLocaleTimeString());
          setShowUserDetails(true);

          // Hide user details and mark attendance after 3 seconds
          setTimeout(() => {
            setShowUserDetails(false);
            setAttendanceMarked(true);
            addData(foundUser._id, foundUser.name);
          }, 3000); 

        } catch (error) {
          console.error("❌ Error fetching user by barcode:", error);
          setUser(null);
        }

        setBarcode("");
      } else {
        console.warn("Invalid barcode length:", barcode);
        setBarcode("");
      }
    }
  };

  const addData = async (userId, userName) => {
    if (!userId || !userName) {
      console.error("❌ Error: Missing userId or userName");
      return;
    }

    const attendanceData = {
      userId: userId,
      name: userName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:3006/api/users/addUserAttendence",
        attendanceData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Attendance data added:", response.data);

      setTimeout(() => {
        setAttendanceMarked(false);
        setUser(null);
      }, 3000);

    } catch (error) {
      console.error("❌ Error adding attendance data:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 text-center border-0 rounded">
            <h3 className="text-primary mb-3">📦 Barcode Attendance System</h3>

            <input
              autoFocus
              type="text"
              className="form-control form-control-lg text-center border-2 border-primary"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="🔍 Scan barcode here..."
            />

            {showUserDetails && (
              <div className="alert alert-info mt-4">
                <h5 className="mb-2">👤 Employee Details</h5>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Job Role:</strong> {user?.role}</p>
                <p><strong>Time:</strong> {scanTime}</p>
              </div>
            )}

            {attendanceMarked && !showUserDetails && (
              <div className="alert alert-success mt-4">
                <h5 className="mb-2">✅ Attendance Marked Successfully!</h5>
              </div>
            )}

            <div className="mt-4">
              <small className="text-muted">Scan barcode to mark attendance.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeAttendance;
