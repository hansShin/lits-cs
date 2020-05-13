import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import MissionControl from '../MissionControl/index';
import PrintPage from '../PrintPage/index';
import Labs from '../Labs/index';

export default function Home() {
  return (
    <Router>
      <Switch>
        <Route path='/mission-control'>
          <MissionControl />
        </Route>
        <Route path='/printer-control'>
          <PrintPage type='status'/>
        </Route>
        <Route path='/printer-status'>
          <PrintPage type='status'/>
        </Route>
        <Route path='/maclab'>
          <Labs type='maclab' />
        </Route>
        <Route path='/pclab1'>
          <Labs type='pclab1' />
        </Route>
        <Route path='/pclab2'>
          <Labs type='pclab2' />
        </Route>
        <Route path='/'>
          <nav>
            <ul>
              <li> <Link to='/mission-control'>mission_control</Link> </li>
              <li> <Link to='/printer-control'>printer_control</Link> </li>
              <li> <Link to='/printer-status'>printer_status</Link> </li>
              <li> <Link to='/maclab'>mac_lab</Link> </li>
              <li> <Link to='/pclab1'>pc_lab_1</Link> </li>
              <li> <Link to='/pclab2'>pc_lab_2</Link> </li>
            </ul>
          </nav>
          <h2> yo, it home </h2>
        </Route>
      </Switch>
    </Router>
  );
}

