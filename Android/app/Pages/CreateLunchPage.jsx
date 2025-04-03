import { View, Text, TouchableOpacity, Alert, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/axios";

const CreateLunchPage = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    const formattedData = {
      userneedscomplete: !!data.userneedscomplete,
      userneedstray: !!data.userneedstray,
      EspecialStray: !!data.EspecialStray,
      userneedsextrajuice: !!data.userneedsextrajuice,
      portionOfProtein: !!data.portionOfProtein,
      portionOfSalad: !!data.portionOfSalad,
    };

    if (
      !formattedData.userneedscomplete &&
      !formattedData.userneedstray &&
      !formattedData.EspecialStray &&
      !formattedData.userneedsextrajuice &&
      !formattedData.portionOfProtein &&
      !formattedData.portionOfSalad
    ) {
      Alert.alert("Error", "Debe seleccionar al menos una opción");
      return;
    }

    if (
      (formattedData.userneedscomplete && formattedData.userneedstray) ||
      (formattedData.EspecialStray &&
        (formattedData.userneedscomplete || formattedData.userneedstray))
    ) {
      Alert.alert(
        "Error",
        "No puede seleccionar combinaciones no permitidas: Almuerzo completo y Bandeja, o Bandeja especial junto con Almuerzo completo o Bandeja"
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post("/lunch", formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error creando lunch:", error);
      Alert.alert("Error", "Error al crear el lunch");
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Text className="text-2xl font-bold mb-5">Pedir Almuerzo</Text>
      <View className="w-full">
        <Controller
          control={control}
          name="userneedscomplete"
          render={({ field: { value } }) => (
            <View className="flex-row items-center mb-4">
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setValue("userneedscomplete", newValue)
                }
              />
              <Text className="ml-2">Almuerzo completo</Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="userneedstray"
          render={({ field: { value } }) => (
            <View className="flex-row items-center mb-4">
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setValue("userneedstray", newValue)
                }
              />
              <Text className="ml-2">Bandeja</Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="EspecialStray"
          render={({ field: { value } }) => (
            <View className="flex-row items-center mb-4">
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setValue("EspecialStray", newValue)
                }
              />
              <Text className="ml-2">Bandeja especial</Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="userneedsextrajuice"
          render={({ field: { value } }) => (
            <View className="flex-row items-center mb-4">
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setValue("userneedsextrajuice", newValue)
                }
              />
              <Text className="ml-2">Jugo adicional</Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="portionOfProtein"
          render={({ field: { value } }) => (
            <View className="flex-row items-center mb-4">
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setValue("portionOfProtein", newValue)
                }
              />
              <Text className="ml-2">Porción de Proteína</Text>
            </View>
          )}
        />
        <Controller
          control={control}
          name="portionOfSalad"
          render={({ field: { value } }) => (
            <View className="flex-row items-center mb-4">
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setValue("portionOfSalad", newValue)
                }
              />
              <Text className="ml-2">Porción de Ensalada</Text>
            </View>
          )}
        />
        <TouchableOpacity
          className="bg-[#008000] w-full h-16 rounded-2xl justify-center items-center mt-5"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-lg font-bold">Pedir</Text>
        </TouchableOpacity>
        {submitted && (
          <View className="mt-4 p-4 bg-green-100 rounded-md">
            <Text className="text-green-700">Se pidió el almuerzo</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CreateLunchPage;
