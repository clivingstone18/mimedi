import React from "react";
import Select from "react-dropdown-select";
import { FaSearch } from "react-icons/fa";

const Multi = ({ options, placeholder, setVal }) => (
  <React.Fragment>
    <Select
      multi

      color="#4ab5bc"
      options={options}
      keepSelectedInList={true}
      dropdownHandle={true}
      placeholder={placeholder}
      dropdownPosition="bottom"
      dropdownHeight="200px"
      direction="left-to-right"
      searchBy="name"
      labelField="name"
      valueField="name"
      values={[]}
      onChange={(value) => setVal(value)}
    />
  </React.Fragment>
);

Multi.propTypes = {};

const SuburbSelect = ({ options, placeholder, setVal }) => (
  <React.Fragment>
    <Select
      multi
      placeholder={placeholder}
      options={options}
      fontSize="10px"
      color="#4ab5bc"
      keepSelectedInList={true}
      dropdownHandle={true}
      dropdownPosition="bottom"
      dropdownHeight="400px"
      direction="left-to-right"
      searchBy="name"
      labelField="name"
      valueField="name"
      values={[]}
      onChange={(value) => setVal(value)}
    />
  </React.Fragment>
);

const services = [
  { name: "Psychologist" },
  { name: "GP" },
  { name: "Dentist" },
  { name: "Optometrist" },
  { name: "Gynaecologist" },
];

const facilities = [
  {
    name: "Wheelchair Access",
  },
  {
    name: "Pathology Nearby",
  },
  {
    name: "Radiology Nearby",
  },
  {
    name: "Train Station Nearby",
  },
  {
    name: "Tram Stop Nearby",
  },
];

const options = [{ name: "TeleHealth" }, { name: "Bulk Billing" }];

/* hard coding a bunch of languages */
const languages = [
  { name: "English" },
  { name: "Japanese" },
  { name: "Korean" },
  { name: "Spanish" },
  { name: "Mandarin" },
  { name: "Cantonese" },
  { name: "Hindi" },
  { name: "Arabic" },
  { name: "Portugese" },
  { name: "Russian" },
  { name: "Bengali" },
  { name: "German" },
  { name: "Yiddish" },
  { name: "Serbian" },
  { name: "French" },
  { name: "Vietnamese" },
  { name: "Urdu" },
  { name: "Tamil" },
];

languages.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

const suburbs = [
  { name: "Carlton", postcodes: ["3053"] },
  { name: "Carlton South", postcodes: ["3050"] },
  { name: "Melbourne", postcodes: ["3000"] },
  { name: "East Melbourne", postcodes: ["3002"] },
  { name: "West Melbourne", postcodes: ["3003"] },
  { name: "Southbank", postcodes: ["3006"] },
  { name: "Docklands", postcodes: ["3008"] },
  { name: "Footscray", postcodes: ["3011"] },
  { name: "Seddon", postcodes: ["3011"] },
  { name: "Ascot Vale", postcodes: ["3032"] },
];

export const DropDownSelect = ({
  onSubmit,
  setServices,
  setOptions,
  setLanguages,
  setSuburbs,
  setFacilities,
}) => {
  return (
    <div
      style={{

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "1.2rem"

      }}
    >
      <h3>Filters</h3>

      <div style={{ alignItems: "center", background: "white" }}>
        <div>
          <SuburbSelect
            setVal={setSuburbs}
            placeholder={"Select a suburb"}
            options={suburbs}
            title={"Select a suburb"}
            color={"light blue"}
          />
          <Multi
            setVal={setServices}
            placeholder={"Select a practitioner type"}
            options={services}
            title={"Search services"}
            color={"light blue"}
          />

          <Multi
            setVal={setFacilities}
            placeholder={"Filter by onsite facilities"}
            options={facilities}
            title={"select facilities"}
            color={"light blue"}
          />
          <Multi
            setVal={setLanguages}
            placeholder={"Filter by languages"}
            options={languages}
            title={"select languages"}
            color={"light blue"}
          />
          <Multi
            setVal={setOptions}
            placeholder={"Filter by additional services"}
            options={options}
            title={"select languages"}
            color={"light blue"}
          />
        </div>

        <br></br>
      </div>
      <button
        class="btn"
        style={{
          alignSelf: "center",
          outline: "none",
          borderRadius: "20px",
          color: "white",
          padding: "0.7rem",
        }}
        onClick={onSubmit}
      >
        <FaSearch color={"white"} size={15} />{" "}
        <span style={{ fontSize: "20px", marginLeft: "5px", marginTop: "3px" }}>
          FIND A PRACTITIONER
        </span>{" "}
      </button>
      <br></br>
    </div>
  );
};
