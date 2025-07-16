// import './App.css'
// import React from "react";
import Layout from '../common/Layout';
import StatsPanel from "./Components/Dashboard/StatsPanel";
// import DashboardBuilder from "./Components/Dashboard/DashboardBuilder";
import MultiCurrencyDashboard from "./Components/currencyDashboard/MultiCurrencyDashboard";
import AlertDashboard from "./Components/alertDashboard/DueWarning";
import DraggableDashboardBuilder from "./Components/DraggableDashboard/DraggableDashboardBuilder";
import DashboardDemo from "./Components/DashboardDemo/DashboardDemo";
import CurrencyExposure from "./Components/NetExposure/NetCurrencyExposure";
import FinancialDashboard from "./Components/StatesDashboard/StatesDashboard";
import BusinessUnitExposureCard from "./Components/BusinessUnitExposureCard/BusinessUnitExposureCard";
import TradingOverviewCards from "./Components/TradingOverviewCards/TradingOverviewCards";

function CFODashboard() {
  return (
    <Layout title="CFO Dashboard">
      <div className=" mt-8 text-center py-4">
        <div className="mt-2 border-b pb-5 mx-4 border-gray-300 text-centerpy-4 text-4xl">
          <span className=" font-medium border-gray-400 pb-1 px-6">CFO Forex Risk Management DashBoard</span>
          <p className="text-lg font-light">Strategic Oversight & Performance Monitoring</p>
        </div>
        <div className="flex">  
          <div className="flex flex-col mt-4 mr-2 text-black w-1/2">
            <div>
              <StatsPanel />
            </div>
            <div>
              <DashboardDemo />
            </div>
            <div className="mr-6">
              <BusinessUnitExposureCard />
            </div>
          </div>
          <div className="mt-8 text-black w-1/2">
            <div className="mb-4">
              <AlertDashboard />
            </div>
            <div className="flex gap-4">
              <div className="w-3/5 mb-6">
                <MultiCurrencyDashboard />
              </div>
              <div className="w-2/5 mb-6">
                <CurrencyExposure />
              </div>
            </div>
            <div>
              <FinancialDashboard />
            </div>
            <div className="my-4 ">
              <TradingOverviewCards />
            </div>
          </div>
          
        </div>
        
        <div className="mt-6">
          <DraggableDashboardBuilder />
        </div>
      </div> 
    </Layout>
  );
}

export default CFODashboard;

