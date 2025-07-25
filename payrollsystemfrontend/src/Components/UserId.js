import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const FetchUserWithAxios = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const barcodeRef = useRef(null);
  const idCardRef = useRef(null);

  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [userId, token]);

  useEffect(() => {
    if (userData && barcodeRef.current) {
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
      } catch (err) {
        console.error("Error generating barcode:", err);
      }
    }
  }, [userData]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const handleDownloadPDF = async () => {
    try {
      // Wait a moment for everything to render
      setTimeout(async () => {
        const canvas = await html2canvas(idCardRef.current, {
          scale: 2,
          allowTaint: true,
          useCORS: false,
          backgroundColor: "#f9f9f9",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", [85, 54]);
        pdf.addImage(imgData, "PNG", 0, 0, 85, 54);
        pdf.save(`${userData.FindUser.userName}_ID_Card.pdf`);
      }, 500);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF generation failed. Please try again.");
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
              src={userData.FindUser.image}
              alt="User Avatar"
              style={{
                width: "150px",
                height: "150px",
                marginTop: "2px",
                objectFit: "cover",
                borderRadius: "8px",
                backgroundColor: "#e9ecef",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {/* Name & Role */}
            <div style={{ width: "100%", textAlign: "left" }}>
              <h4 style={{ margin: "10px 0" }}>
                <strong>Employee Name:</strong> {userData.FindUser.userName}
              </h4>
              <h4 style={{ margin: "10px 0" }}>
                <strong>Employee Role:</strong> {userData.FindUser.role}
              </h4>
              <h4 style={{ margin: "0px 0" }}>
                <strong>Emp ID:</strong> EMP {userData.FindUser.CorrectuserId}
              </h4>
            </div>

            {/* Barcode */}
            <div style={{ marginTop: "0px" }}>
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