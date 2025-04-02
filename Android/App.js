import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import { AuthProvider } from "./app/context/AuthContext";
import MainNavigator from "./app/navigations/MainNavigator";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <StatusBar style="auto" />
        <MainNavigator />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
