import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import IndexPage from "./routes/Index";
import LoginPage from "./routes/Login";
import RegisterPage from "./routes/Register";
import DashboardPage from "./routes/dashboard/Dashboard";
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoutes';
import BankCallback from './routes/dashboard/BankCallback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestRoute><IndexPage /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/bank/callback" element={<ProtectedRoute><BankCallback /></ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  </StrictMode >,
)
