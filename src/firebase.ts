import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDJdBSp9giT5OldEJSmJI6BtJwyYB2oJl0",
  authDomain: "personal-aphasia-testing.firebaseapp.com",
  databaseURL: "https://personal-aphasia-testing-default-rtdb.firebaseio.com",
  projectId: "personal-aphasia-testing",
  storageBucket: "personal-aphasia-testing.appspot.com",
  messagingSenderId: "191433257647",
  appId: "1:191433257647:web:1f81c05d7baf8b647f5a5a",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDb = getDatabase(firebaseApp);

// if (process.env.NODE_ENV !== "production") {
//   // Connect to the local emulator if not in production (https://firebase.google.com/docs/emulator-suite/connect_functions)
//   connectFunctionsEmulator(firebaseCloudFunctions, "localhost", 5000);
// }
