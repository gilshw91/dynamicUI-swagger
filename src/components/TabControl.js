import React from 'react';
import PropTypes from 'prop-types';
import './TabControl.css';

const TabControl = ({ headers, activeHeader, onHeaderClick, children }) => {
  return (
    <div className="row">
      <div className="col-3">
        <div
          className="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
        >
          {headers.map(header => (
            <a
              key={header}
              className={
                header === activeHeader ? 'nav-link active' : 'nav-link'
              }
              id="v-pills-home-tab"
              data-toggle="pill"
              href="#v-pills-home"
              role="tab"
              onClick={() => onHeaderClick(header)}
            >
              {header}
            </a>
          ))}
        </div>
      </div>
      <div className="col-9">
        <div className="tab-content" id="v-pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="v-pills-home"
            role="tabpanel"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

TabControl.propTypes = {
  headers: PropTypes.array.isRequired,
  activeHeader: PropTypes.string.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
  children: PropTypes.object,
};

export default TabControl;
