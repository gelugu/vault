import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, set, get } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_VAULT_API_KEY,
  authDomain: "gelugu-vault.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_VAULT_DATABASE_URL,
  projectId: "gelugu-vault",
  storageBucket: "gelugu-vault.appspot.com",
  messagingSenderId: "887180943043",
  appId: "1:887180943043:web:25df0f6628a092f3de0c76",
  measurementId: "G-Y00RVNTE0X",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      console.log(credential, token, user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log(errorCode, errorMessage, email, credential);
    });
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("Loged out");
    })
    .catch((error) => {
      console.error(error);
    });
};

export const database = getDatabase(app);

export const write = (key, value) => {
  set(ref(database, "users/" + auth.currentUser.uid + "/" + btoa(key)), {
    value: btoa(value),
  });
};

export const read = async (key) => {
  const dbRef = ref(database);

  return get(child(dbRef, `users/${auth.currentUser.uid}/${btoa(key)}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return atob(snapshot.val().value);
      } else {
        console.error("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
