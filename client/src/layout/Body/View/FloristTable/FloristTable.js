import React, { useState, useEffect } from "react";
import FloristListView from "./FloristListView/FloristListView";
import FloristQueue from "./FloristQueue/FloristQueue";
import Container from "../../../../atoms/Container/Container";
import { handleLoadFloristJob } from "../../../../scripts/actions/floristjobActions";
import Tab from "../../../../atoms/Tab/Tab";
import { connect } from "react-redux";
import "./FloristTable.css";
import FloristProduction from "./FloristProduction/FloristProduction";

const FloristTable = ({ handleLoadFloristJob }) => {
  const [tabView, setTabView] = useState(1);

  useEffect(() => {
    handleLoadFloristJob();
  }, []);

  const renderItems = () => {
    switch (tabView) {
      case 1:
        return <FloristQueue handleLoadFloristJob={handleLoadFloristJob} />;
      case 2:
        return <FloristListView handleLoadFloristJob={handleLoadFloristJob} />;
      case 3:
        return <FloristProduction handleLoadFloristJob={handleLoadFloristJob} />;
      default:
        return <FloristQueue handleLoadFloristJob={handleLoadFloristJob} />;
    }
  };

  return (
    <Container css="grd _florist_table over-hid pad-1 slideInRight animate-1 relative">
      <span className="header pad-y-1">Florist {tabView === 1 ? 'Queue' : tabView === 2 ? 'Live Monitoring' : 'Production'}</span>
      <div className="grd jis" style={{gridTemplateColumns: "auto auto 1fr"}}>
        <Tab onClick={() => setTabView(1)} active={tabView === 1}>
          Queue
        </Tab>
        <Tab onClick={() => setTabView(2)} active={tabView === 2}>
          Live Monitoring
        </Tab>
        <Tab onClick={() => setTabView(3)} active={tabView === 3}>
          On Production
        </Tab>
      </div>
      {renderItems()}
    </Container>
  );
};

export default connect(
  null,
  { handleLoadFloristJob }
)(FloristTable);
