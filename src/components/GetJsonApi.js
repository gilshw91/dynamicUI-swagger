import React from "react";
import PropTypes from "prop-types";

import CreateComponents from "./CreateComponents";
import { useFetch } from "../hooks/useFetch";

//import { mockData } from '../mockData';

const GetJsonApi = ({ specsApiUrl }) => {
  const [{ data, loading, error }] = useFetch(specsApiUrl);
  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Fetch failed: {error}</div>
  ) : (
    data && <CreateComponents specsJson={data} />
  );
};

GetJsonApi.propTypes = {
  specsApiUrl: PropTypes.string.isRequired,
};

export default GetJsonApi;
