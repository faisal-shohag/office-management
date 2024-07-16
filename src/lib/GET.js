// import axios from "axios";

const api_key = import.meta.env.VITE_serverKey;
console.log(api_key)

const getData = (url) => {
    return fetch(api_key + url, {
      method: "GET",
      credentials: "include",
    });
  };


// const getDataWithQuery(url, query) => {
//   return axios.
// }


  export {getData}