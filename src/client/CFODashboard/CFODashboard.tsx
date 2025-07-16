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
import RecentTradingActivityCard from "./Components/TradingOverviewCards/RecentTradingActivityCard";
import ForwardMaturityAnalysisCard from "./Components/TradingOverviewCards/ForwardMaturityAnalysisCard";

function CFODashboard() {
  return (
    <Layout title="CFO Dashboard">
      <div className="text-center py-4">
        <div className="grid grid-cols-2 gap-6">  
          <div className="flex flex-col ">
            <div>
              <StatsPanel />
            </div>
            <div className='mt-6'>
              <DashboardDemo />
            </div>
            <div className="mt-6">
              <BusinessUnitExposureCard />
            </div>
            <div className="mt-6">
              <RecentTradingActivityCard />
            </div>
          </div>
          <div className="">
            <div className="">
              <AlertDashboard />
            </div>
            <div className="grid grid-cols-[1.5fr_1fr] gap-6 mt-6">
              <div className="">
                <MultiCurrencyDashboard />
              </div>
              <div className="">
                <CurrencyExposure />
              </div>
            </div>
            <div className='mt-6'>
              <FinancialDashboard />
            </div>
            <div className="mt-6">
              <ForwardMaturityAnalysisCard />
            </div>
          </div>
          
        </div>
        
        <div className="mt-10">
          <DraggableDashboardBuilder />
        </div>
      </div> 
    </Layout>
  );
}

export default CFODashboard;

