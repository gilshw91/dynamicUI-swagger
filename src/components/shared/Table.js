import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '../../utils';

const Table = ({ columns, body }) => {
  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {columns.map(column => (
            <th>{capitalize(column)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map(row => (
          <tr>{JSON.stringify(row)}</tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  body: PropTypes.array,
};

export default Table;
