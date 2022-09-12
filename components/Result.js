import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Result = ({ prediction }) => {
  return (
    <>
      {prediction !== "0" && prediction && (
        <View style={styles.resultCont}>
          <Text style={styles.resultText}>{prediction}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  resultCont: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  resultText: {
    fontSize: 30,
    backgroundColor: "black",
    padding: 5,
    color: "white",
  },
});

export default Result;
