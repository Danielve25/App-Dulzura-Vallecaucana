import { createDrawerNavigator } from "@react-navigation/drawer";
import LunchPage from "../Pages/LunchPage";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Lunch" component={LunchPage} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
