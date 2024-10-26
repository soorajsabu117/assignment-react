import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ImportCsv({ apiUrl }) {
  const [csvFile, setCsvFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!csvFile) {
      setErrorMessage("Please select a CSV file to upload.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("access_token", token);
    formData.append("csv_file", csvFile);

    try {
      const response = await fetch(apiUrl + "/file_upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "File upload failed");
      }

      const data = await response.json();
      if (data.status == 1) {
        setSuccessMessage(data.message || "File uploaded successfully!");
        setErrorMessage("");
        setTimeout(function () {
          navigate("/products-list");
        }, 2500);
      } else {
        setErrorMessage(data.message || "Faild to upload csv");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <form className="form-signin" onSubmit={handleSubmit}>
          <h2 className="form-signin-heading">Upload CSV File</h2>

          <div className="form-group">
            <input
              type="file"
              className="form-control"
              accept=".csv"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <br></br>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Upload
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
