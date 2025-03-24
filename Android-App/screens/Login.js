import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import Label from "../components/label";

const UserImage = require("../assets/userImage.png");

export default function Login() {
  return (
    <View style={styles.container}>
      <View>
        <Image source={UserImage} style={styles.profileImage} />
      </View>

      <View style={styles.card}>
        <Text style={styles.loginText}>Inicio de sesion</Text>
        <View style={styles.textInputNombreContainer}>
          <Label text="Nombre" required />
          <TextInput style={styles.textInputNombre} placeholder="Nombre" />
        </View>

        <View style={styles.textInputPhoneContainer}>
          <Label text="Teléfono" required />
          <TextInput
            style={styles.textInputPhone}
            placeholder="Numero de telefono"
          />
        </View>

        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesion</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.notAccount}>no tienes una cuenta?</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "black",
  },
  card: {
    margin: 24,
    backgroundColor: "#E9E9E9",
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 24,
  },
  cajaTexto: {},
  textInputNombre: {
    fontWeight: "",
    marginTop: 8,
    height: 56,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    paddingLeft: 16,
    borderRadius: 16,
    color: "#000000",
  },
  textInputPhone: {
    marginTop: 8,
    height: 56,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    paddingLeft: 16,
    borderRadius: 16,
    color: "#000000",
  },
  textInputNombreContainer: {
    marginBottom: 16,
  },
  textInputPhoneContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: "#008000",
    borderRadius: 16,
    width: "100%",
    height: 56,
    marginBlock: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  notAccount: {
    color: "#0EA5E9",
    textAlign: "center",
    fontSize: 14,
  },
});
