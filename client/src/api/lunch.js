import axios from "./axios";

export const getLunchsRequest = () => axios.get("/lunchs");

export const getLunchRequest = (id) => axios.get(`/lunch/${id}`);

export const createLunchRequest = (lunch) => axios.post("/lunch", lunch);

export const updateLunchRequest = (lunch, lunchID) =>
  axios.put(`/lunch/${lunchID}`, lunch);

export const deleteLunchRequest = (id) => axios.delete(`/lunch/${id}`);
