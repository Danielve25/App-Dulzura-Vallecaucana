import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import React from "react";
import Label from "../components/Label";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      NameStudent: "",
      PhoneNumber: "",
    },
  });
  const { signup, errors: registerErrors } = useAuth();

  const navigator = useNavigation();

  const onSubmit = (data) => {
    const formattedData = {
      NameStudent: data.NameStudent.toUpperCase(),
      PhoneNumber: data.PhoneNumber,
    };
    signup(formattedData);
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <View className="w-full">
        {registerErrors.length > 0 && (
          <View className="mb-4 bg-red-500 flex justify-center items-center h-16">
            {registerErrors.map((error, i) => (
              <Text key={i} className="text-white text-lg text-center">
                {error}
              </Text>
            ))}
          </View>
        )}
        <Text className="text-2xl font-bold mb-3">Registrarse</Text>
        <View className="mb-7">
          <Controller
            control={control}
            name="NameStudent"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <Label text="Nombre del Estudiante" required />
                <TextInput
                  className="border-[2px] h-16 w-full text-[16px] px-3 bg-slate-100 rounded-2xl p-2"
                  placeholder="Nombre del estudiante"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.NameStudent && (
            <Text className="text-red-500 text-lg">
              El numero de Nombre es requerido
            </Text>
          )}
        </View>
        <View className="">
          <Controller
            control={control}
            name="PhoneNumber"
            rules={{
              required: true,
              minLength: 10,
              maxLength: 10,
              pattern: /^[0-9]+$/, // Validación para permitir solo números
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <Label text="Número de Teléfono" required />
                <TextInput
                  className="border-[2px] h-16 w-full mt-3 px-3 text-[16px] bg-slate-100 rounded-2xl p-2"
                  placeholder="Número de teléfono"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.PhoneNumber && (
            <Text className="text-red-500 text-lg">
              {errors.PhoneNumber.type === "pattern"
                ? "El número de teléfono solo debe contener dígitos"
                : "El número de teléfono es requerido y debe tener 10 dígitos"}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="bg-[#008000] w-full h-16 rounded-2xl justify-center items-center my-7"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-lg font-bold">Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigator.goBack("Login")}>
          <Text className="text-sky-500 text-center text-[16px]">
            ¿Ya tienes una cuenta? Iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
