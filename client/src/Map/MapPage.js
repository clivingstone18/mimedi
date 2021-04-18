import React, {useEffect, useState} from "react";
import {Map} from "./Map";
import {DropDownSelect} from "./DropDownSelect"
import axios from "axios";
import * as Scroll from 'react-scroll';

import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
let findPracs = "http://localhost:5000/api/findPrac"


export const MapPage = () => {
    const [GP, setGP] = useState([]);
    const [dent, setDent] = useState([]);
    const [opto, setOpto] = useState([]);
    const [psych, setPsych] = useState([]);
    const [gyno, setGyno] = useState([]);
  
    const [languages, setLanguages] = useState([]);
    const [suburbs, setSuburbs] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [services, setServices] = useState([{name:"Psychologist"},
    {name:"GP"},{name:"Optometrist"},{name:"Dentist"},{name:"Gynaecologist"}]);
    const [options, setOptions] = useState([]);
  
    const onSubmit = () => {
      /* resset all */ 
      setGP([]);
      setOpto([]);
      setPsych([]);
      setDent([]);
      setGyno([]);
  
      if (suburbs.length == 0) {
        alert(
          "Please include a suburb!"
        )
      }
      console.log(services);
      // then, send to backend
      axios.post(findPracs, {suburbs, languages, facilities, services, options}).then(res=>{
        let data = res.data
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == "Psychologist") {
            setPsych(data[i].response);
          }
          if (data[i].name  == "Optometrist") {
            setOpto(data[i].response);
          }
          if (data[i].name  == "Dentist") {
            setDent(data[i].response);
          }
          if (data[i].name  == "GP") {
            setGP(data[i].response);
          }
          if (data[i].name  == "Gynaecologist") {
            setGyno(data[i].response);
          }
        }
        scroll.scrollToBottom();

      })
    }

    return(
        <>

        <h1 style={{color:"#42C0BD"}}>Mi Search</h1>
        <DropDownSelect onSubmit={onSubmit} setOptions={setOptions} setServices={setServices} setLanguages={setLanguages} setSuburbs={setSuburbs} setFacilities={setFacilities}/>

        <Map to="map" GP={GP} dent={dent} psych={psych} opto={opto} gyno={gyno} />

        </>




    )

}
















