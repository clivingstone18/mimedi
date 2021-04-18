import React, { useState} from "react";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from "react-datetime-picker";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { addEvent } from "../Calendar.js";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";

const options = ["GP", "Optometrist", "Psychologist", "Dentist", "Gynaecologist"];

const FormInput = styled.input`
background: white;
border:none;
border-radius: 50px;
height:20px;
`

const Btn = styled.button`
padding: 0.4rem;
outline:none;
color:#424B92;
width: 100px;
border-radius: 50px;
border: none;
font-weight:bold;
background:white;

`

export const AddNewApp = () => {
  const [appType, setAppType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  let history = useHistory();

  const onSubmit = () => {
    console.log(location, date, appType);

    let startRaw = new Date(date);
    let endRaw = new Date(date);
    endRaw.setMinutes(startRaw.getMinutes() + 30);

    let start = {
      dateTime: startRaw.toISOString().toString(),
      timeZone: "Australia/Sydney",
    };

    let end = {
      dateTime: endRaw.toISOString().toString(),
      timeZone: "Australia/Sydney",
    };

    let event = {
      summary: `MiMedi: ${appType} Appointment at ${location}`,
      location: `${location}`,
      start: start,
      end: end,
    };
    addEvent(event).then((response) => history.push("/cal"));
  };

  return (
    <div style={{ color: "white", padding: "1.2rem" }}>
      <h1 style={{ color: "#8ED9D7" }}>MiCal</h1>
      <div
        style={{
          padding: "0.5rem",
          margin: "0 auto",
          borderRadius: "30px",
          background: "#8ED9D7",
          height: "400px",
        }}
      >
        <FaTimes
          onClick={() => history.goBack()}
          size={30}
          style={{
            color: "#8ED9D7",
            position: "absolute",
            top: "0.5rem",
            right: "0rem",
          }}
        />

        <h1>New appointment</h1>

        <div
          style={{
            marginBottom: "10px",
            padding: "0.8rem",
          }}
        >
          <label style={{ marginRight: "20px" }}>Date and Time</label>
          <DateTimePicker
            disableClock={true}
            disableCalendar={true}
            locale={"US"}
            onChange={(date) => setDate(date)}
            value={date}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:"space-around",
            marginBottom: "10px",

          }}
        >
          <label>Appointment Type</label>

          <Dropdown
            options={options}
            onChange={(val) => setAppType(val.value)}
            value={appType}
            placeholder="Select a type"
          />

        </div>

        <div
          style={{
            marginBottom: "10px",
            padding: "0.8rem",
          }}
        >
          <label style={{ marginRight: "20px" }}>Location</label>
          <FormInput type="text" onChange={(e) => setLocation(e.target.value)} />
        </div>
        <br></br>

        <Btn
          onClick={onSubmit}
        >
          Add
        </Btn>
      </div>
    </div>
  );
};
