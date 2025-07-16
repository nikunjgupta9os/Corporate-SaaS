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
// import MastersPage from "./client/common/Masters/Masters";
// import ExposureBucketing from "./client/fx/exposureBucketing.tsx/index.tsx";
import ExposureUpload from "./client/fx/exposureUpload.tsx/index.tsx";
import Hedgingproposal from "./client/fx/hedgingproposal/index.tsx";
// import  from "./";
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
            {/* <Route
              path="/masters"
              element={
                <>
                  <MastersPage />
                </>
              }
            /> */}
            
            <Route
              path="/hedging-dashboard"
              element={
                <>
                  <NetExposure />
                </>
              }
            />
            <Route
              path="/fxbooking"
              element={
                <>
                  <FXForwardBookingForm />
                </>
              }
            />
            <Route
              path="/ops-dashboard"
              element={
                <>
                  <OPSDashboard />
                </>
              }
            />
            <Route
              path="/cfo-dashboard"
              element={
                <>
                  <CFODashboard />
                </>
              }
            />
            <Route
              path="/user"
              element={
                <>
                  <Users />
                </>
              }
            />
            <Route
              path="/user/create"
              element={
                <>
                  <UserCreationForm />
                </>
              }
            />
            <Route
              path="/role"
              element={
                <>
                  <Roles />
                </>
              }
            />
            <Route
              path="/entity"
              element={
                <>
                  <Entity />
                </>
              }
            />
            <Route
              path="/hierarchical"
              element={
                <>
                  <Hierarchical />
                </>
              }
            />
            <Route
              path="/role/create"
              element={
                <>
                  <RoleCreation />
                </>
              }
            />
            <Route
              path="/permission"
              element={
                <>
                  <Permission />
                </>
              }
            />
            <Route
              path="/exposure-upload"
              element={
                <>
                  <ExposureUpload />
                </>
              }
            />
            {/* <Route path="/exposure-bucketing" element={<ExposureBucketing />} /> */}
            <Route
              path="/hedging-proposal"
              element={
                <>
                  <Hedgingproposal />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;
