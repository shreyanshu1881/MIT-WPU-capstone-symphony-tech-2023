import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import DocumentEditor from './routes/DocumentEditor';
import LandingPage from './routes/LandingPage';
import Signup from './routes/Signup';
import Home from './routes/Home';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter,Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import { v4 as uuidV4 } from "uuid";
const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <AuthProvider
    authType={"cookie"}
    authName={"_auth"}
    cooieDomain={window.location.hostname}
    cookieSecure={false}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
          <Route path="/Home" element={
            <RequireAuth loginPath={'/'}>
              <Home />
            </RequireAuth>
          } />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/DocumentEditor" exact element={
            <RequireAuth loginPath={'/'}>
              <Navigate to={`/documents/${uuidV4()}`} />
            </RequireAuth>
          } />
          <Route path="/documents/:id" element={
            <RequireAuth loginPath={'/'}>
              <DocumentEditor />
            </RequireAuth>
          } />
          
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
