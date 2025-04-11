import { AxiosRequestHeaders } from "axios";
import apiClient from "./ApiClient";

const contentTypes: any = {
  json: "application/json",
  mfd: "multipart/form-data",
};

// Base function for GET requests
const get = (route: string, token?: String, baseUrl?: string) => {
  let headers: AxiosRequestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  } as AxiosRequestHeaders;

  if (token != null) {
    if (token.length > 5) headers.Authorization = `Bearer ${token}`;
  }
  return apiClient(`${baseUrl}/${route}`, {
    headers: headers,
  });
};

// Base function for POST requests
const post = async (
  route: string,
  { body, type = "", token = "" }: { body: any; type?: string; token?: String },
  baseUrl: string, 
) => {
  let headers: AxiosRequestHeaders = {
    Accept: "application/json",
    
    "Content-Type": "application/json",
  } as AxiosRequestHeaders;
  if (token !== "") {
    headers.Authorization = `Bearer ${token}`;
  }
  if (type !== "") {
    headers["Content-Type"] = type;
  }

  return apiClient({
    method: "post",
    url: `${baseUrl}/${route}`,
    headers,
    data: body,
  });
};


// Base function for DELETE requests

const del = async (
  route: string,
  { token = "" }: { token?: String },
  baseUrl: string
) => {
  let headers: AxiosRequestHeaders = {
    
    Accept: "*/*",
     "Content-Type": "application/json",
  } as AxiosRequestHeaders;
  if (token !== "") {
    headers.Authorization = `Bearer ${token}`;
  }
  return apiClient({
    method: "delete",
    url: `${baseUrl}/${route}`,
    headers
  });
};


// Base function for PUT requests

const put = async (
  route: string,
  {body, type = '', token = ''}: {body: any; type?: string; token?: String},
  baseUrl:string
) => {
 
  let headers: AxiosRequestHeaders = {Accept: 'application/json','Content-Type': 'application/json'} as AxiosRequestHeaders;
  if (token!== '') {
 
    headers.Authorization = `Bearer ${token}`;
  }
  if (type !== '') {
    headers['Content-Type'] = contentTypes[type];
  }
 
  return apiClient({
    method: 'put',
    url: `${baseUrl}/${route}`,
    headers,
    data: body,
  });
};
// Routes

export { get, post ,del ,put };

// export {loginApi} from './api/LoginApi';
// export {getUserDetails} from './Profiledetails';