import axios from "./axios";

export const getMenuToday = async () => axios.get("/menu");
export const createMenu = async (data) => axios.post("/menu", data);
