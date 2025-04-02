import { View, Text } from "react-native";
import React from "react";

const Label = ({ text, required }) => {
  return (
    <View className="flex-row items-center">
      <Text className="text-[16px]">{text}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
  );
};

export default Label;
