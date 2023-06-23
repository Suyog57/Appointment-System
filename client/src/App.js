import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//components
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
//pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ApplyDoctor = lazy(() => import("./pages/ApplyDoctor"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const Users = lazy(() => import("./pages/admin/Users"));
const Doctors = lazy(() => import("./pages/admin/Doctors"));
const Profile = lazy(() => import("./pages/doctor/Profile"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const Appointments = lazy(() => import("./pages/Appointments"));
const DoctorAppointments = lazy(() =>
  import("./pages/doctor/DoctorAppointments")
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/apply-doctor" element={<ApplyDoctor />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/doctors" element={<Doctors />} />
            <Route path="/doctor/profile/:id" element={<Profile />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route
              path="/doctor/book-appointment/:doctorId"
              element={<BookingPage />}
            />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="*" element={<Navigate to={"/"} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
