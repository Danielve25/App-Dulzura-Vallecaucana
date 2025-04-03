import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLunches = async () => {
  const token = await AsyncStorage.getItem("token");
  return axios.get("/lunchs", {
    headers: {
      Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
    },
  });
};
