import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./client/common/Login";
import Users from "./client/uam/Users";
import { ThemeProvider } from "./client/contexts/ThemeContext";
import UserCreationForm from "./client/uam/Users/UserCreationForm";
import Roles from "./client/uam/Roles/index";
import RoleCreation from "./client/uam/Roles/RoleCreationForm";
import Permission from "./client/uam/Permission/index";
import ForgotPassword from "./client/common/ForgotPassword";
import MastersPage from "./client/common/Masters/Masters";
import ExposureBucketing from "./client/fx/exposureBucketing.tsx/index.tsx";
import ExposureUpload from "./client/fx/exposureUpload.tsx/index.tsx";
import Hedgingproposal from "./client/fx/hedgingproposal/index.tsx";
import ProtectedRoute from "./ProtectedRoute";
import Entity from "./client/entity/EntityCreation";
import Hierarchical from "./client/entity/entityHiearchy";
import PreloaderAnimation from "./client/common/Preloader";
// import AllUsers from "./client/fx/hedgingproposal/pp.tsx";
// import K from "./client/fx/exposureBucketing.tsx/K";
import CFODashboard from "./client/CFODashboard/CFODashboard.tsx";
import OPSDashboard from "./client/OPSDashboard/OPSDashboard.tsx";
import NetExposure from "./client/fx/NetPosition/netPosition.tsx";
import FXForwardBookingForm from "./client/fx/NetPosition/FxBooking.tsx";
import NotificationProvider from "./client/Notification/Notification.tsx";

function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PreloaderAnimation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* <Route path="/pp" element={<AllUsers />} />
            <Route path="/k" element={<K />} /> */}
            {/* Protected Routes */}
            <Route
              path="/masters"
              element={
                <ProtectedRoute>
                  <MastersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cfo-dashboard"
              element={
                <ProtectedRoute>
                  <CFODashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hedging-dashboard"
              element={
                <ProtectedRoute>
                  <NetExposure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fxbooking"
              element={
                <ProtectedRoute>
                  <FXForwardBookingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ops-dashboard"
              element={
                <ProtectedRoute>
                  <OPSDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/create"
              element={
                <ProtectedRoute>
                  <UserCreationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/role"
              element={
                <ProtectedRoute>
                  <Roles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entity"
              element={
                <ProtectedRoute>
                  <Entity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hierarchical"
              element={
                <ProtectedRoute>
                  <Hierarchical />
                </ProtectedRoute>
              }
            />
            <Route
              path="/role/create"
              element={
                <ProtectedRoute>
                  <RoleCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/permission"
              element={
                <ProtectedRoute>
                  <Permission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exposure-upload"
              element={
                <ProtectedRoute>
                  <ExposureUpload />
                </ProtectedRoute>
              }
            />
            <Route path="/exposure-bucketing" element={<ExposureBucketing />} />
            <Route
              path="/hedging-proposal"
              element={
                <ProtectedRoute>
                  <Hedgingproposal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;
