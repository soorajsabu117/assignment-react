import React, { useState, useContext } from "react";
import "../styles.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Signup({ apiUrl }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNameInput = (e) => {
    setName(e.target.value);
    if (e.target.value.trim() === "") {
      setFieldErrors((prev) => ({ ...prev, name: ["Name is required."] }));
    } else {
      setFieldErrors((prev) => ({ ...prev, name: null }));
    }
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(e.target.value)) {
      setFieldErrors((prev) => ({ ...prev, email: ["Invalid email format."] }));
    } else {
      setFieldErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setFieldErrors((prev) => ({
        ...prev,
        password: ["Password must be at least 6 characters long."],
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, password: null }));
    }
  };

  const handleCPasswordInput = (e) => {
    setCPassword(e.target.value);
    if (e.target.value !== password) {
      setFieldErrors((prev) => ({
        ...prev,
        cpassword: ["Passwords do not match."],
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, cpassword: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (name == "" || email == "" || password == "") {
      setErrorMessage("Please fill all the fields.");
      return;
    }
    if (Object.values(fieldErrors).some((error) => error)) {
      setErrorMessage("Please fix the errors above.");
      return;
    }
    try {
      const response = await fetch(apiUrl + "/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
          setSuccessMessage(data.message || "Registration successful!");
          setTimeout(function () {
            navigate("/products-list");
          }, 1000);
        } else {
          if (data.errors && Object.keys(data.errors).length > 0) {
            setFieldErrors(data.errors);
          } else {
            setErrorMessage(data.message || "Registration failed");
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
          <h2 className="form-signin-heading">Sign Up</h2>
          <input
            type="text"
            className="form-control"
            value={name}
            placeholder="Name"
            onChange={handleNameInput}
          />
          {fieldErrors.name && (
            <p className="error-message">{fieldErrors.name[0]}</p>
          )}
          <input
            type="text"
            className="form-control"
            value={email}
            placeholder="Email Address"
            onChange={handleEmailInput}
          />
          {fieldErrors.email && (
            <p className="error-message">{fieldErrors.email[0]}</p>
          )}
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={handlePasswordInput}
          />
          {fieldErrors.password && (
            <p className="error-message">{fieldErrors.password[0]}</p>
          )}
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            value={cpassword}
            onChange={handleCPasswordInput}
          />
          {fieldErrors.cpassword && (
            <p className="error-message">{fieldErrors.cpassword[0]}</p>
          )}
          <br></br>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Register
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
