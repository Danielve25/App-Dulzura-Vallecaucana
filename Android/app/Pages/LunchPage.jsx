import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect
import { getLunches } from "../api/lunch";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"; // Importar el idioma español

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

  const calculateTotal = () => {
    return lunches.reduce((total, item) => total + (item.userNeedsPay || 0), 0);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={80} color="#F76905" />
        <Text>Cargando almuerzos...</Text>
      </View>
    );
  }

  return (
    <View className="px-3">
      <View className="p-4">
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Total a pagar: {calculateTotal()}
        </Text>
      </View>
      <FlatList
        data={lunches}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-4 border-2 my-2 rounded-2xl">
            <Text className="font-bold text-[21px]">{item.title}</Text>
            <Text className="text-[14px] mb-4 text-gray-600">
              Creado{" "}
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
                locale: es, // Configurar el idioma español
              })}
            </Text>
            {item.EspecialStray && (
              <Text className="text-[17px] mb-4 font-bold">
                Bandeja especial: {item.EspecialStray ? "Si" : null}
              </Text>
            )}
            {item.userneedscomplete && (
              <Text className="text-[17px] mb-4 font-bold">
                Almuerzo Completo {item.userneedscomplete ? "Si" : null}
              </Text>
            )}
            {item.userneedstray && (
              <Text className="text-[17px] mb-4 font-bold">
                Bandeja: {item.userneedstray ? "Si" : null}
              </Text>
            )}
            {item.userneedsextrajuice && (
              <Text className="text-[17px]">
                Jugo extra: {item.userneedsextrajuice ? "Si" : null}
              </Text>
            )}
            {item.portionOfSalad && (
              <Text className="text-[17px]">
                Porcion de proteina: {item.portionOfProtein ? "Si" : null}
              </Text>
            )}
            {item.portionOfSalad && (
              <Text className="text-[17px]">
                Porcion de ensalada: {item.portionOfSalad ? "Si" : null}
              </Text>
            )}
            <Text className="text-[17px]">pago: {item.pay ? "Si" : "No"}</Text>
            <Text className="text-[17px]">
              Valor a pagar: {item.userNeedsPay}
            </Text>
            <Text className="text-[14px] mb-4 text-gray-600">
              Actualizado{" "}
              {formatDistanceToNow(new Date(item.updatedAt), {
                addSuffix: true,
                locale: es, // Configurar el idioma español
              })}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

export default LunchPage;
