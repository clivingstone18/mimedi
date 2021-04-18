import React, { useState, useEffect } from "react";
import BigCalendar, { Views } from "react-big-calendar";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Toolbar from "./ToolBar"
import styled from 'styled-components'
import {getAllApps} from "./Calendar"
import "react-big-calendar/lib/css/react-big-calendar.css";
import {getTodaysEvents, getCompletedApps, addNewEvent} from "./Calendar"
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const API_KEY = "AIzaSyBlj1VnMflja9kGA73CB4VQ1rHTa2-oOO4";

const Btn = styled.button`
padding: 0.3rem;
outline:none;
color:#424B92;
width: 150px;
border-radius: 50px;
border: none;
font-weight:bold;
background:white;

`


export const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [gpCompleted, setGPCompleted] = useState(0);
  const [opCompleted, setOpCompleted] = useState(0);
  const [psychCompleted, setPsychCompleted] = useState(0);
  const [dentCompleted, setDentCompleted] = useState(0);
  const [gynoCompleted, setGynoCompleted] = useState(0);

  const history = useHistory();

  const [todaysEvents, setTodaysEvents] = useState([]);



  var gapi = window.gapi;
  var CLIENT_ID =
    "249886028801-4635vef8o4vjcgj539du52m6go3u3vnk.apps.googleusercontent.com";
  var API_KEY = "AIzaSyBlj1VnMflja9kGA73CB4VQ1rHTa2-oOO4";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";

  /* gets all upcoming events for today */


  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load("calendar", "v3", () => console.log("hello?"));

      let instance = gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          let request = gapi.client.calendar.events.list({
            calendarId: "primary",
            showDeleted: false,
            orderBy: "updated",
            maxResults: 2000,
          });

          request.execute((event) => {
            let res = event.items.filter(
              (i) => i.summary && i.summary.includes("MiMedi")
            );

            let psychApps = res.filter(
              (i) => i.summary && i.summary.includes("Psychologist")
            );
            psychApps = psychApps.map((elem) => {
              return {
                title: elem.summary,
                start: new Date(elem.start.dateTime),
                end: new Date(elem.start.dateTime),
                allDay: false,
                type: "Psych",
              };
            });
            let GPApps = res.filter(
              (i) => i.summary && i.summary.includes("GP")
            );
            GPApps = GPApps.map((elem) => {
              return {
                title: elem.summary,
                start: new Date(elem.start.dateTime),
                end: new Date(elem.start.dateTime),
                allDay: false,
                type: "Gp",
              };
            });
            let OpApps = res.filter(
              (i) => i.summary && i.summary.includes("Optometrist")
            );

            OpApps = OpApps.map((elem) => {
              return {
                title: elem.summary,
                start: new Date(elem.start.dateTime),
                end: new Date(elem.start.dateTime),
                allDay: false,
                type: "Op",
              };
            });

            let DentApps = res.filter(
              (i) => i.summary && i.summary.includes("Dentist")
            );

            DentApps = DentApps.map((elem) => {
              return {
                title: elem.summary,
                start: new Date(elem.start.dateTime),
                end: new Date(elem.start.dateTime),
                allDay: false,
                type: "Dent",
              };
            });

            let gynoApps = res.filter(
              (i) => i.summary && i.summary.includes("Gynaecologist")
            );

            gynoApps = gynoApps.map((elem) => {
              return {
                title: elem.summary,
                start: new Date(elem.start.dateTime),
                end: new Date(elem.start.dateTime),
                allDay: false,
                type: "Gyno",
              };
            });




            let meds = res.filter(
              (i) => i.summary && i.summary.includes("Dose of")
            );
            let medsEvents = [];

            meds.map((elem) => {
              let numDays = elem.recurrence[0].split("COUNT=")[1];
              let currentDate = moment(new Date(elem.start.dateTime));
              console.log(currentDate);
              for (let i = 0; i < numDays; i++) {
                medsEvents.push({
                  title: elem.summary,
                  start: currentDate._d,
                  end: currentDate._d,
                  allDay: true,
                  type: "Med",
                });
                currentDate = moment(currentDate).add(1, "days");
              }
            });

            console.log(medsEvents);

            setEvents(
              [GPApps, gynoApps, DentApps, OpApps, psychApps, medsEvents].flat(Infinity)
            );
            setTodaysEvents(
              getTodaysEvents(
                [medsEvents, gynoApps, GPApps, DentApps, OpApps, psychApps].flat(Infinity)
              )
            );

            setGPCompleted(getCompletedApps(GPApps));
            setDentCompleted(getCompletedApps(DentApps));
            setOpCompleted(getCompletedApps(OpApps));
            setPsychCompleted(getCompletedApps(psychApps));
            setGynoCompleted(getCompletedApps(gynoApps))
          });
        });
    });
  }, []);


  let formats = {
    dateFormat: "DD",

    dayFormat: (date, culture, localizer) =>
      localizer.format(date, "DD", culture),

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, { date: "short" }, culture) +
      " — " +
      localizer.format(end, { date: "short" }, culture),
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#8ED9D7" }}>MiCal</h1>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: "10px",
          }}
        >
          <Btn
            style={{ border: "none", color: "white", background: "#8ED9D7" }}
            onClick={() => history.push("/addNewMed")}
          >
            {" "}
            + medication{" "}
          </Btn>

          <br></br>

          <Btn
            style={{ border: "none", color: "white", background: "#8ED9D7" }}
            onClick={() => history.push("/addNewApp")}
          >
            {" "}
            + appointment{" "}
          </Btn>
        </div>

        <BigCalendar
          popupOffset={0}
          localizer={localizer}
          events={events}
          components={{
            toolbar:Toolbar
          }}
          step={60}
          showMultiDayTimes
          style={{ height: 500 }}
          eventPropGetter={(event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "lightgrey",
              color: "black",
              borderRadius: "0px",
              border: "none",
            };

            if (event.type == "Gp") {
              newStyle.backgroundColor = "#295FA6";
            } else if (event.type == "Psych") {
              newStyle.backgroundColor = "#FCC8E1";
            } else if (event.type == "Dent") {
              newStyle.backgroundColor = "#C4C4C4";
            } else if (event.type == "Op") {
              newStyle.backgroundColor = "#B1FF81";
            }
            else if (event.type == "Gyno") {
              newStyle.backgroundColor = "#FF0000";
            }

            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </div>
    </div>
  );
};
