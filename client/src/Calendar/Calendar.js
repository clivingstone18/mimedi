import moment from "moment";

export const getTodaysEvents = (info) => {
  let events = [];
  for (let i = 0; i < info.length; i++) {
    if (
      moment().diff(new Date(info[i].start)) < 0 &&
      moment().diff(new Date(info[i].start)) > -129600000
    ) {
      console.log(moment().diff(new Date(info[i].start)));
      events.push(info[i]);
    }
  }
  return events;
};

/* gets the number of app u have had of a given */

export const getCompletedApps = (info) => {
  let numApps = 0;
  for (let i = 0; i < info.length; i++) {
    if (moment().diff(new Date(info[i].start)) > 0) {
      numApps++;
    }
  }
  return numApps;
};

var gapi = window.gapi;
var CLIENT_ID =
  "249886028801-4635vef8o4vjcgj539du52m6go3u3vnk.apps.googleusercontent.com";
var API_KEY = "AIzaSyBlj1VnMflja9kGA73CB4VQ1rHTa2-oOO4";
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
var SCOPES = "https://www.googleapis.com/auth/calendar.events";

export const getAllApps = () => {
  return new Promise((resolve, reject) => {

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
          let GPApps = res.filter((i) => i.summary && i.summary.includes("GP"));
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

          resolve({
            numGP: getCompletedApps(GPApps),
            numDent: getCompletedApps(DentApps),
            numOp: getCompletedApps(OpApps),
            numPsych: getCompletedApps(psychApps),
            numGyno: getCompletedApps(gynoApps),
          })
        })
      })
    })
  })
}

export const addNewEvent = (summary, location, start, end) => {
  var event = {
    summary: "MiMedi: " + summary,
    location: location,
    start: start,
    end: end,
  };
  return event;
};

export const addCalendarEvent = async (info) => {
  return new Promise((resolve, reject) => {
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
            window.open(event.htmlLink);
            resolve("DONE");
          });
        });
      });
    });
  });
};

export const addEvent = async (event) => {
  return new Promise((resolve, reject) => {
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
          var request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          request.execute((event) => {
            resolve("DONE");
          });
        });
      });
    });
  });
};
