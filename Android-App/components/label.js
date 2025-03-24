import React from "react";
import { Text, StyleSheet } from "react-native";

const Label = ({ text, required = false, style }) => {
  return (
    <Text style={[styles.label, style]}>
      {text}
      {required && <Text style={styles.asterisk}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  asterisk: {
    color: "red",
  },
});

export default Label;
