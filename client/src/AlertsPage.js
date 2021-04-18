import React, { useEffect, useState } from "react";
import axios from "axios";

let alertsLink = "http://localhost:5000/api/getAlerts";
export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get(alertsLink).then((res) => {
      setAlerts(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div style={{padding:"1rem"}}>
      <h1 style={{ color: "#42C0BD" }}>Mi Alert</h1>
      {alerts.map((alert,i) => {
        return (
          <div key={i} style={{marginBottom:"10px",fontWeight:"bold", color:"white"}}>
            <div style={{background:"#42C0BD"}}>{alert.date}</div>
            <div style={{color: "gray", background:"#DDFAF9"}}>{alert.blurb}</div>
          </div>
        );
      })}
    </div>
  );
};
