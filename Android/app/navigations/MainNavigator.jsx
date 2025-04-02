import StackNavigator from "./StackNavigator";
import DrawerNavigator from "./DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";

const MainNavigator = () => {
  return (
    <NavigationContainer>
      {/*<DrawerNavigator />*/}

      <StackNavigator />
    </NavigationContainer>
  );
};

export default MainNavigator;
