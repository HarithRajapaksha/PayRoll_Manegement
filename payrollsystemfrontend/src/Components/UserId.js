import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

const FetchUserWithAxios = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const barcodeRef = useRef(null);
  const idCardRef = useRef(null);

  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3006/api/users/admin/${userId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (userData && barcodeRef.current) {
      // Generate barcode from user ID or a specific barcode field
    // Generate barcode from user ID or a specific barcode field
    console.log("User Data:", userData.FindUser.barcode);
JsBarcode(barcodeRef.current, userData.FindUser.barcode, {
  format: "EAN13",
  lineColor: "#000",
  displayValue: true,
  fontSize: 16,
  height: 60,
  width: 2,
  margin: 10
});

    }
  }, [userData]);

  const handleDownloadPDF = async () => {
    if (idCardRef.current) {
      try {
        const canvas = await html2canvas(idCardRef.current, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");

        const width = 85 * 3.779528;
        const height = 54 * 3.779528;

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [width, height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`${userData.FindUser.userName}_ID_Card.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  return (
    <div>
     
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {userData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <h2>User Information</h2>
          <div
            ref={idCardRef}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              width: "650px",
              height: "500px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Profile Image */}
            <img
              src="https://via.placeholder.com/80"
              alt="User Avatar"
              style={{
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                marginTop: "10px",
              }}
            />

            {/* Name & Role */}
            <div style={{ width: "100%", textAlign: "left" }}>
              <h4 style={{ margin: "10px 0" }}>
                <strong>User Name:</strong> {userData.FindUser.userName}
              </h4>
              <h4 style={{ margin: "10px 0" }}>
                <strong>Role:</strong> {userData.FindUser.role}
              </h4>
              <h4 style={{ margin: "10px 0" }}>
                <strong>Emp ID:</strong> {userData.FindUser._id}
              </h4>
            </div>

            {/* Barcode */}
            <div style={{ marginTop: "20px" }}>
              <svg ref={barcodeRef}></svg>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadPDF}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download ID Card as PDF
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FetchUserWithAxios;
