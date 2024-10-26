import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { AuthContext } from "./AuthContext";

export default function Login({ apiUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting the default way

    try {
      const response = await fetch(apiUrl + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
      } else {
        const data = await response.json();
        setErrorMessage("");
        setFieldErrors({});
        if (data.status == 1) {
          login(data.oData.access_token || "");
          localStorage.setItem("user", data.oData);
          setSuccessMessage("Login successful!");
          setTimeout(function () {
            navigate("/products-list");
          }, 1000);
        } else {
          if (data.errors && Object.keys(data.errors).length > 0) {
            setFieldErrors(data.errors);
          } else {
            setErrorMessage(data.message || "Login failed");
            setFieldErrors({}); // Clear field errors if none are provided
          }
        }

        // Perform further actions like redirecting or updating app state
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  return (
    <div>
      <div className="wrapper">
        <form className="form-signin" onSubmit={handleSubmit}>
          <h2 className="form-signin-heading">Please login</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={email}
              placeholder="Email Address"
              onChange={handleEmailInput}
              required
            />
            {fieldErrors.email && (
              <p className="error-message">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={handlePasswordInput}
              required
            />
            {fieldErrors.password && (
              <p className="error-message">{fieldErrors.password[0]}</p>
            )}
          </div>
          <br></br>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Login
          </button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
