import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useHistory } from "react-router-dom";
import { GetAddress } from "./GetAddress";
import "@reach/combobox/styles.css";
import { DateTimeMenu } from "./DateTimeMenu";
const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const handleOpen = (link) => {
  window.open(link);
};

export const Map = ({ opto, dent, GP, psych, gyno }) => {
  const [center, setCenter] = useState({ lat: -37.8, lng: 144.96 });
  const [calView, setCalView] = useState(false);
  const [calendarPrompt, showCalendarPrompt] = useState(false);
  const [selected, setSelected] = useState();
  const [addresses, setAddresses] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [sum, setSum] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const obtainImgUrl = (i) => {
    if (i < sum[0]) {
      return "psych.svg";
    }
    if (i < sum[0] + sum[1]) {
      return "gp.svg";
    }
    if (i < sum[0] + sum[1] + sum[2]) {
      return "dentist.svg";
    }
    if (i < sum[0] + sum[1] + sum[2] + sum[3]) {
      return "optometrist.svg";
    }
    return "gyno.svg";
  };

  const getType = (i) => {
    if (i < sum[0]) {
      return "Psychologist";
    }
    if (i < sum[0] + sum[1]) {
      return "GP";
    }
    if (i < sum[0] + sum[1] + sum[2]) {
      return "Dentist";
    }
    if (i < sum[0] + sum[1] + sum[2] + sum[3]) {
      return "Optometrist";
    }
    return "Gynaecologist";
  };

  useEffect(() => {
    setSum([psych.length, GP.length, dent.length, opto.length, gyno.length]);
    // which index do they start at ?
    let promises = [];
    promises.push(GetAddress(psych));
    promises.push(GetAddress(GP));
    promises.push(GetAddress(dent));
    promises.push(GetAddress(opto));
    promises.push(GetAddress(gyno));
    Promise.all(promises).then((res) => {
      setMarkers(res.flat(Infinity));
      setAddresses([psych, GP, dent, opto, gyno].flat(Infinity));
    });
  }, [opto, dent, GP, psych, gyno]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  if (center) {
    return (
      <div>
        <div
          style={{
            background: "green",
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
          }}
        ></div>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={center}
          options={options}
          onLoad={onMapLoad}
        >
          {markers.map((val, i) => {
            return (
              <Marker
                key={i}
                position={{ lat: val.lat, lng: val.lng }}
                onClick={() => {
                  setSelected({ val: val, i: i });
                  showCalendarPrompt(false);
                  setCalView(false);
                }}
                icon={{
                  url: obtainImgUrl(i),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            );
          })}

          {selected ? (
            <div>
              <InfoWindow
                position={{ lat: selected.val.lat, lng: selected.val.lng }}
                onCloseClick={() => {
                  setSelected(null);
                  showCalendarPrompt(false);
                  setCalView(false);
                }}
              >
                <div style={{ padding: "rem" }}>
                  {!calendarPrompt && !calView && (
                    <>
                      <h2>
                        {addresses[selected.i].nameOfClinic
                          .replaceAll("-", " ")
                          .toUpperCase()}
                      </h2>
                      <h3>{addresses[selected.i].address}</h3>

                      <h3>Languages</h3>
                      {addresses[selected.i].pracLanguages.map((j) => {
                        return <p>{j}</p>;
                      })}

                      {addresses[selected.i].bulkBill && <h3>Bulk Billing</h3>}
                      {addresses[selected.i].teleHealth && (
                        <h3>Telehealth Available</h3>
                      )}

                      <button
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          padding: "0.8rem",
                          borderRadius: "20px",
                        }}
                        className="btn"
                        onClick={() => {
                          showCalendarPrompt(true);
                          handleOpen(addresses[selected.i].link);
                        }}
                      >
                        BOOK NOW
                      </button>
                    </>
                  )}

                  {calendarPrompt && (
                    <>
                      <img
                        style={{ width: "100px", height: "100px" }}
                        src="owl.png"
                      ></img>

                      <p>Looks like you have booked an appointment!</p>
                      <p>Would you like to add it to your MiCal?</p>

                      <button
                        style={{
                          marginRight: "10px",
                          fontWeight: "bold",
                          color: "white",
                          padding: "0.25rem",
                          borderRadius: "20px",
                        }}
                        class="btn"
                        onClick={() => {
                          setSelected("");
                          showCalendarPrompt(false);
                        }}
                      >
                        {" "}
                        No - keep looking.
                      </button>
                      <button
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          padding: "0.25rem",
                          borderRadius: "20px",
                        }}
                        class="btn"
                        onClick={() => {
                          setCalView(true);
                          showCalendarPrompt(false);
                        }}
                      >
                        Add to calendar
                      </button>
                    </>
                  )}

                  {calView && (
                    <DateTimeMenu
                      item={addresses[selected.i]}
                      type={getType(selected.i)}
                    />
                  )}
                </div>
              </InfoWindow>
            </div>
          ) : null}
        </GoogleMap>
      </div>
    );
  } else {
    return <div>LOADING</div>;
  }
};

