import { View, Text, StyleSheet } from "react-native";
import React from "react";

const LoadingScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={[styles.title, styles.text]}>Be My Eye</Text>
      <Text style={[styles.loadingText, styles.text]}>قيد التشغيل...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 50,
  },
  loadingText: {
    fontWeight: "600",
  },
  text: {
    fontSize: 30,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default LoadingScreen;
