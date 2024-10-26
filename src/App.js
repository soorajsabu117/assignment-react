import "./App.css";
import "./styles.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Products from "./components/Products";
import ImportCsv from "./components/ImportCsv";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

function App() {
  const apiUrl = "http://127.0.0.1:9000/api/v1";
  return (
    <Router>
      <AuthProvider>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Login apiUrl={apiUrl}></Login>}></Route>
          <Route
            path="/sign-up"
            element={<Signup apiUrl={apiUrl}></Signup>}
          ></Route>

          <Route
            path="/products-list"
            element={
              <ProtectedRoute>
                <Products apiUrl={apiUrl}></Products>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/import-csv"
            element={
              <ProtectedRoute>
                <ImportCsv apiUrl={apiUrl} />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
