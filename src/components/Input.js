import { colors, FloatAnimation, View } from "@gelugu/react-uikit";
import React, { useCallback, useEffect, useState } from "react";
import { auth, signInWithGoogle, logout, read } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const Input = () => {
  const navigate = useNavigate();

  const [currentKey, setCurrentKey] = useState("");
  const [word, setWord] = useState("");
  const [color, setColor] = useState(colors.text);
  const [position, setPosition] = useState();
  const [loader, setLoader] = useState(false);

  const getRandomPosition = useCallback(() => {
    const getRandomValue = () => Math.floor(Math.random() * 100);

    return {
      x: getRandomValue(),
      y: getRandomValue(),
    };
  }, []);

  const clear = useCallback(() => {
    setWord("");
    setCurrentKey("");
  }, []);

  const backspace = useCallback(() => {
    setWord(word.slice(0, -1) || "");
    setCurrentKey(word[word.length - 2] || "");

    setPosition(getRandomPosition());
  }, [word, getRandomPosition]);

  const doAction = useCallback(() => {
    const actions = {
      auth: signInWithGoogle,
      exit: logout,
      write: () => {
        navigate("write");
      },
    };

    try {
      setLoader(true);

      actions[word.slice(1, word.length)]();

      clear();

      return true;
    } catch {
      return false;
    } finally {
      setLoader(false);
    }
  }, [navigate, clear, word]);

  const submit = useCallback(async () => {
    if (word[0] === ":") {
      doAction();

      return;
    }

    if (!auth.currentUser) {
      console.error("Not authorized");

      clear();

      return;
    }

    if (!word) {
      // ToDo: visulize it
    }

    try {
      setLoader(true);

      console.log(await read(word));

      return word;
    } finally {
      setLoader(false);
      clear();
    }
  }, [word, clear, doAction]);

  const onFunctionalKeyPress = useCallback(
    (functionalKey) => {
      const functionalKeys = {
        Escape: clear,
        Backspace: backspace,
        Enter: submit,
      };

      try {
        functionalKeys[functionalKey]();
        return true;
      } catch {
        return false;
      }
    },
    [clear, backspace, submit]
  );

  const onKeyPress = useCallback(
    (event) => {
      if (onFunctionalKeyPress(event.key)) return;

      const allowedKeys = /^[a-zA-Z0-9:]+$/;

      setCurrentKey(event.key);

      if (allowedKeys.exec(event.key)) {
        setPosition(getRandomPosition());
        setWord(word + event.key);
        setColor(colors.text);
      } else {
        setColor(colors.warn);
      }
    },
    [word, onFunctionalKeyPress, getRandomPosition]
  );

  useEffect(() => {
    document.addEventListener("keypress", onKeyPress);

    return () => document.removeEventListener("keypress", onKeyPress);
  }, [onKeyPress]);

  return (
    <FloatAnimation toPosition={position}>
      {currentKey && <View borderColor={color}>{currentKey}</View>}
      {loader && <View borderColor={colors.secondary}>{"Loading..."}</View>}
    </FloatAnimation>
  );
};
