import React, { useState } from "react";
import { View, Input, Button } from "@gelugu/react-uikit";
import { auth, signInWithGoogle, write } from "../config/firebase";

export const Write = () => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const keyChange = ({ target }) => {
    setKey(target.value);
  };

  const valueChange = ({ target }) => {
    setValue(target.value);
  };

  const send = () => {
    if (!auth.currentUser) {
      signInWithGoogle();
      return;
    }

    if (!key || !value) return;

    write(key, value);
    setKey("");
    setValue("");
  };

  return (
    <View direction="column" positionY="center">
      <Input placeholder="key" onChange={keyChange} value={key} />
      <Button onClick={send}>:</Button>
      <Input
        placeholder="value"
        onChange={valueChange}
        value={value}
        type="password"
      />
    </View>
  );
};
