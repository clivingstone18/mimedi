import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useHistory } from "react-router-dom";
const addNewEvent = (summary, location, start, end) => {
  var event = {
    summary: "MiMedi: " + summary,
    location: location,
    start: start,
    end: end,
  };
  return event;
};

function addCalendarEvent(info) {
  console.log(info);
  let startRaw = new Date(info.date);
  let endRaw = new Date(info.date);
  endRaw.setMinutes(startRaw.getMinutes() + 30);

  let start = {
    dateTime: new Date(info.date).toISOString().toString(),
    timeZone: "Australia/Sydney",
  };

  let end = {
    dateTime: endRaw.toISOString().toString(),
    timeZone: "Australia/Sydney",
  };

  var gapi = window.gapi;
  var CLIENT_ID =
    "249886028801-4635vef8o4vjcgj539du52m6go3u3vnk.apps.googleusercontent.com";
  var API_KEY = "AIzaSyBlj1VnMflja9kGA73CB4VQ1rHTa2-oOO4";
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  var SCOPES = "https://www.googleapis.com/auth/calendar.events";

  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    });

    gapi.client.load("calendar", "v3", () => {
      let instance = gapi.auth2.getAuthInstance().then(() => {
        var event = addNewEvent(info.summary, info.location, start, end);

        var request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        request.execute((event) => {
          return "DONE";
        });
      });
    });
  });
}

export const DateTimeMenu = ({ item, type }) => {
  const history = useHistory();
  console.log(item, type)
  const [date, onChange] = useState(new Date());
  let location = item.address;
  let summary = `${type} Appointment at ${item.nameOfClinic
    .replaceAll("-", " ")
    .toUpperCase()}`;

  // assume a 30 min appointment

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3>Your appointment details</h3>
        <p>Summary: {summary}</p>
        <p>Location: {location} </p>

        <div>
          <DateTimePicker
            disableClock={true}
            disableCalendar={true}
            locale={"US"}
            onChange={(a) => {
              onChange(a);
              console.log(a);
            }}
            value={date}
          />
        </div>
      </div>

      <br></br>

      <button
        onClick={() => {
          addCalendarEvent({ summary, location, date, type });
          history.push("/cal");
        }}
        style={{
          fontWeight: "bold",
          color: "white",
          padding: "0.4rem",
          borderRadius: "20px",
        }}
        class="btn"
      >
        Confirm appointment
      </button>
    </>
  );
};
