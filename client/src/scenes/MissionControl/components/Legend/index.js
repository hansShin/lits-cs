import React from 'react';
import './styles.css';

export default function Legend() {
  return (
    <div id="legend">
      <h2 className="section-title">color_legend</h2>
      <ul>
        <li>
          <div className="attending-legend"></div>
          <p>attending</p>
        </li>
        <li>
          <div className="sick-leave-legend"></div>
          <p>out_sick</p>
        </li>
        <li>
          <div className="coverage-needed-legend"></div>
          <p>coverage_needed</p>
        </li>
        <li>
          <div className="coverage-provided-legend"></div>
          <p>coverage_provided</p>
        </li>
      </ul>
    </div>
  );
}
