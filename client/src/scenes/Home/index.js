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
import './styles.css';

export default function Home() {
  return (
    <Router>
      <Switch>
        <Route path='/missioncontrol'>
          <MissionControl />
        </Route>
        <Route path='/printstaff'>
          <PrintPage type='control'/>
        </Route>
        <Route path='/printers'>
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
          <div className='container'>
            <h2 id="page-title">Links for LITS-CS</h2>
            <nav>
              <ul className='nav-links'>
                <li className='nav-link'>
                  <Link to='/missioncontrol'>
                    <p>Mission Control</p>
                  </Link>
                </li>
                <li className='nav-link'>
                  <Link to='/printstaff'>
                    <p>Print Staff</p>
                  </Link>
                </li>
                <li className='nav-link'>
                  <Link to='/printers'>
                    <p>Printers (public view)</p>
                  </Link>
                </li>
                <li className='nav-link'>
                  <Link to='/maclab'>
                    <p>Mac Lab 1 Display</p>
                  </Link>
                </li>
                <li className='nav-link'>
                  <Link to='/pclab1'>
                    <p>PC Lab 1 Display</p>
                  </Link>
                </li>
                <li className='nav-link'>
                  <Link to='/pclab2'>
                    <p>PC Lab 2 Display</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

