import React from 'react';
import PropTypes from 'prop-types';

import CreateComponents from './CreateComponents';
import { useFetch } from '../hooks/useFetch';

const GetJsonApi = ({ specsApiUrl }) => {
  const { response, loading, error } = useFetch(specsApiUrl);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Fetch failed: {error}</div>
  ) : (
    response && <CreateComponents specsJson={response} />
  );
};

GetJsonApi.propTypes = {
  specsApiUrl: PropTypes.string.isRequired,
};

export default GetJsonApi;
