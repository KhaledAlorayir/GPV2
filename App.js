//imports
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as tf from "@tensorflow/tfjs";
import {
  cameraWithTensors,
  bundleResourceIO,
} from "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";

//components
import PlaySound from "./components/PlaySound";
import Result from "./components/Result";

//global consts
const TensorCamera = cameraWithTensors(Camera);
const H = Platform.OS === "ios" ? 480 : 64;
const W = Platform.OS === "ios" ? 270 : 64;
const CW = Dimensions.get("window").width;
const CH = CW / (9 / 16);

export default function App() {
  //App state
  const [tfReady, setTfReady] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [model, setModel] = useState();
  const rafid = useRef(null);
  const labels = ["0", "5", "10", "50", "100"];

  //Load Model
  const start = async () => {
    rafid.current = null;
    await Camera.requestCameraPermissionsAsync();
    await tf.ready();

    const modelJSON = require("./model/model.json");
    const modelWeights = require("./model/weights.bin");

    const local_model = await tf.loadLayersModel(
      bundleResourceIO(modelJSON, modelWeights)
    );
    setModel(local_model);

    setTfReady(true);
  };

  //call start onload, clear loop on destroy
  React.useEffect(() => {
    start();

    return () => {
      if (rafid.current != null && rafid.current !== 0) {
        cancelAnimationFrame(rafid.current);
        rafid.current = 0;
      }
    };
  }, []);

  //handle camera frames
  const CameraStreamHandler = (imgs, update_preview, gl) => {
    const loop = async () => {
      if (rafid.current === 0) {
        return;
      }

      tf.tidy(() => {
        try {
          const imgTensor = imgs.next().value.expandDims(0).div(127.5).sub(1);
          const f = (H - W) / 2 / H;

          const cropped = tf.image.cropAndResize(
            imgTensor,
            tf.tensor2d([f, 0, 1 - f, 1], [1, 4]),
            [0],
            [224, 224]
          );

          const result = model.predict(cropped);
          const data = result.dataSync();

          if (data) {
            const max = Math.max(...data);
            const label_index = data.indexOf(max);
            const accurecy = max * 100;
            //console.log(accurecy);
            if (accurecy >= 95) {
              setPrediction(labels[label_index]);
            }
          }
        } catch (error) {}
      });
      rafid.current = requestAnimationFrame(loop);
    };
    loop();
  };

  //loading ui
  if (!tfReady) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loading_text}>Loading..</Text>
      </View>
    );
  }
  //App ui
  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        autorender={true}
        type={Camera.Constants.Type.back}
        resizeWidth={W}
        resizeHeight={H}
        resizeDepth={3}
        onReady={CameraStreamHandler}
      />
      <Result prediction={prediction} />
      <PlaySound prediction={prediction} />
    </View>
  );
}

//styling
const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: CW,
    height: CH,
    marginTop: Dimensions.get("window").height / 2 - CH / 2,
  },
  camera: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
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
    backgroundColor: "red",
    padding: 5,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading_text: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
