import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";

const PlaySound = ({ prediction }) => {
  const [sound, setSound] = useState();

  const play = async () => {
    if (prediction) {
      let x = null;

      if (prediction === "1") {
        x = await Audio.Sound.createAsync(require("../sound/1.mp3"));
      } else if (prediction === "5") {
        x = await Audio.Sound.createAsync(require("../sound/5.mp3"));
      } else if (prediction === "10") {
        x = await Audio.Sound.createAsync(require("../sound/10.mp3"));
      } else if (prediction === "50") {
        x = await Audio.Sound.createAsync(require("../sound/50.mp3"));
      } else if (prediction === "100") {
        x = await Audio.Sound.createAsync(require("../sound/100.mp3"));
      } else if (prediction === "500") {
        x = await Audio.Sound.createAsync(require("../sound/500.mp3"));
      }
      if (x) {
        setSound(x.sound);
        x.sound.playAsync();
      }
    }
  };

  useEffect(() => {
    if (prediction) {
      play();
    }
  }, [prediction]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  });

  return null;
};

export default PlaySound;
