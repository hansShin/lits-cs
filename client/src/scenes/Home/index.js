import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import MissionControl from '../MissionControl/index';
import PrintPage from '../PrintPage/index';
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
                  <a href='/maclab'>
                    <p>Mac Lab 1 Display</p>
                  </a>
                </li>
                <li className='nav-link'>
                  <a href='/pclab1'>
                    <p>PC Lab 1 Display</p>
                  </a>
                </li>
                <li className='nav-link'>
                  <a href='/pclab2'>
                    <p>PC Lab 2 Display</p>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

