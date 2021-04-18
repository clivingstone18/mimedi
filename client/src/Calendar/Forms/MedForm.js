import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { addEvent } from ".././Calendar.js";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components"

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

export const MedForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [timesPerDay, setTimesPerDay] = useState();
  const [dosesEachTime, setDosesEachTime] = useState();
  const [numInBox, setNumInBox] = useState();
  const [name, setName] = useState("");
  let history = useHistory();

  const onSubmit = () => {
    if (!numInBox || !timesPerDay || !dosesEachTime || !name) {
      return;
    }

    let numDays = Math.ceil(numInBox / (timesPerDay * dosesEachTime));

    let event = {
      summary: `MiMedi: Dose of ${name}`,
      start: {
        dateTime: new Date(startDate).toISOString(),
        timeZone: "Australia/Sydney",
      },
      singleEvents: true,
      end: {
        dateTime: new Date(startDate).toISOString(),
        timeZone: "Australia/Sydney",
      },
      recurrence: [`RRULE:FREQ=DAILY;COUNT=${numDays}`],
    };

    addEvent(event).then((response) => history.push("/cal"));
  };

  return (
    <div style={{ color: "white", padding: "1.5rem" }}>
      <h1 style={{ color: "#8ED9D7" }}>MiCal</h1>

      <div
        style={{
          padding: "1.2rem",
          margin: "0 auto",

          borderRadius: "10px",
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
        <h1>New medication</h1>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "20px" }}>Med Name</label>
          <FormInput onChange={(e) => setName(e.target.value)} type="text"></FormInput>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "20px" }}>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "20px" }}>Doses in box</label>
          <FormInput
            onChange={(e) => setNumInBox(e.target.value)}
            type="text"
          ></FormInput>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "20px" }}>Doses each time</label>
          <FormInput
            onChange={(e) => setDosesEachTime(e.target.value)}
            type="text"
          ></FormInput>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "20px" }}>Times per day</label>
          <FormInput
            onChange={(e) => setTimesPerDay(e.target.value)}
            type="text"
          ></FormInput>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Before Meal</label>
          <FormInput type="checkbox"></FormInput>

          <label>After Meal</label>

          <FormInput type="checkbox"></FormInput>
        </div>

        <div>
          <label style={{marginTop:"5px"}}>Notify by email?</label>
          <FormInput type="checkbox"></FormInput>
        </div>

        <br></br>

        <Btn
          style={{
            padding: "0.4rem",
            width: "100px",
            borderRadius: "20px",
            border: "none",
          }}
          onClick={onSubmit}
        >
          Submit
        </Btn>
      </div>
    </div>
  );
};
