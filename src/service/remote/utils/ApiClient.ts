import axios from 'axios';
import statusHandler from './StatusHandler';

// Add a request interceptor
axios.interceptors.request.use(
  async function (config) {
    // console.log("urll.. here" + config.url);
    // console.log((JSON.stringify(config, null, 2)));
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // console.log("error from interceptor...");
    //  console.log(error.response.data);
    // console.log(error.response.data.message);
    statusHandler(error);
    return Promise.reject(error);
  },
);

export default axios;