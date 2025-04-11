/**
 * Status Handler - For handling network responses
 */
import { AxiosError } from 'axios';
const StatusHandler = (err: AxiosError) => {
  if (err.response) {
    switch (err.response.status) {
      case 400: {
        // 401: bad request, please try again

        break;
      }
      case 401: {
        // 401: unauthroised, please try again

        break;
      }
      case 404: {
        // 404: not found , please try again

        break;
      }
      case 500: {
        // 500: Internal server error, please try again

        break;
      }
      default: {

      }
    }
  }
};

export default StatusHandler;
