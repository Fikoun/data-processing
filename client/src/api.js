import axios from 'axios';

const developmentURL = "http://localhost:5000/api/";
const productionURL = `https://${new URL(window.location).hostname}/api`;

const axios_instance = axios.create({
  baseURL: developmentURL
});

class Api {
  get = async (url, token=false) => {
    let auth = {};
    if (token === false) 
      token = localStorage.getItem('token');
    
    if (token) {
      auth = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
    return await axios_instance.get(url, auth)
  }

  post = async (url, data,token=false) => {
    let auth = {};
    if (token === false) 
      token = localStorage.getItem('token');
      
    if (token) {
      auth = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }

    return await axios_instance.post(url,data, auth)
  }
 
}


export default new Api();