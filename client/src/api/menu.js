import axios from "./axios";

export const getMenu = async () => axios.get("/menu");
export const createMenu = async (data) => axios.post("/menu", data);
