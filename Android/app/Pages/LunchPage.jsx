import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect
import { getLunches } from "../api/lunch";

const LunchPage = () => {
  const [lunches, setLunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLunches = async () => {
        setLoading(true);
        try {
          const res = await getLunches();
          setLunches(res.data);
        } catch (error) {
          console.error("Error fetching lunches:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchLunches();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={80} color="#F76905" />
        <Text>Cargando almuerzos...</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={lunches}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default LunchPage;
