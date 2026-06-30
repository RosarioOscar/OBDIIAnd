import axios from "axios";
//NHTSA API utility functions

const nhtsaApi = axios.create({
    baseURL:"https://vpic.nhtsa.dot.gov/api/vehicles/",
    setTimeout: 5000,
 


})

export const getVinDetails = async (vin) => {
  try {
    const response = await nhtsaApi.get(`/DecodeVin/${vin}?format=json`);
    
    return response.data;
  } catch (error) {
    console.error('Error in getVinDetails:', error);
    throw error;
  }
};