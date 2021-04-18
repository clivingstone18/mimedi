import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {MedForm} from "./Calendar/Forms/MedForm"
import {AddNewApp} from "./Calendar/Forms/AddNewApp"
import {AlertsPage} from "./AlertsPage"
import {CalendarPage} from "./Calendar/CalendarPage"
import {MapPage} from "./Map/MapPage"

/* routes are just set up for convenience */ 

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
        <Route exact path="/map" component={MapPage} />
        <Route exact path="/cal" component={CalendarPage} />
        <Route exact path="/addNewMed" component={MedForm} />
        <Route exact path="/addNewApp" component={AddNewApp} />
        <Route exact path="/alerts" component={AlertsPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
