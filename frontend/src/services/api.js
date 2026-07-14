// // src/services/api.js

// import axios from 'axios';

// // Backend ka base URL
// const API_URL = 'http://localhost:3000/api'; // Aapka backend is port par chal raha hai

// // Sabhi locations laane ke liye function
// export const fetchAllLocations = () => {
//   return axios.get(`${API_URL}/locations`);
// };

// // Source aur Destination ke beech shortest path nikalne ke liye
// export const findShortestPath = (sourceId, destinationId) => {
//   return axios.post(`${API_URL}/graph/shortest-path`, {
//     source: sourceId,
//     destination: destinationId
//   });
// };

// // Location search karne ke liye
// export const searchForLocations = (query) => {
//     return axios.get(`${API_URL}/locations/search/${query}`);
// };

const API = "http://localhost:3000/api";

export async function searchLocation(keyword) {

    const response = await fetch(
        `${API}/locations/search/${keyword}`
    );

    return await response.json();

}

export async function getShortestPath(source, destination) {

    const response = await fetch(
        `${API}/graph/shortest-path`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                source,
                destination
            })
        }
    );

    return await response.json();

}