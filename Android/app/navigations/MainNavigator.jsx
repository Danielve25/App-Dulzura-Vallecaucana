import StackNavigator from "./StackNavigator";
import DrawerNavigator from "./DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext"; // Asegúrate de que la ruta sea correcta

const MainNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <DrawerNavigator /> : <StackNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;
