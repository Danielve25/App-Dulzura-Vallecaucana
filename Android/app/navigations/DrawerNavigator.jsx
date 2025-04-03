import { createDrawerNavigator } from "@react-navigation/drawer";
import LunchPage from "../Pages/LunchPage";
import CreateLunchPage from "../Pages/CreateLunchPage"; // Importar la nueva página

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Lunch" component={LunchPage} />
      <Drawer.Screen name="Crear Lunch" component={CreateLunchPage} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
