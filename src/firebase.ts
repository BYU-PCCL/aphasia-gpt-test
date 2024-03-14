import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDOhZYlfsTk_35E2KiHIYw1TB52KwZksMM",
  authDomain: "brocas-userdb.firebaseapp.com",
  databaseURL: "https://brocas-userdb-default-rtdb.firebaseio.com",
  projectId: "brocas-userdb",
  storageBucket: "brocas-userdb.appspot.com",
  messagingSenderId: "795464505175",
  appId: "1:795464505175:web:13d2917301e88d1c5e9012",
  measurementId: "G-Y2Y96HEC28",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDb = getDatabase(firebaseApp);

// if (process.env.NODE_ENV !== "production") {
//   // Connect to the local emulator if not in production (https://firebase.google.com/docs/emulator-suite/connect_functions)
//   const firebaseCloudFunctions = getFunctions(firebaseApp);
//   connectFunctionsEmulator(firebaseCloudFunctions, "localhost", 5000);
// }

const isProduction = process.env.NODE_ENV === "production";
export const SET_TEST_CASE_API_ENDPOINT = isProduction
  ? "https://us-central1-brocas-userdb.cloudfunctions.net/setTestCase"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/setTestCase";
export const GET_ALL_TEST_CASES_API_ENDPOINT = isProduction
  ? "https://us-central1-brocas-userdb.cloudfunctions.net/getAllTestCases"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/getAllTestCases";
export const TEST_PROMPT_API_ENDPOINT = isProduction
  ? "https://us-central1-brocas-userdb.cloudfunctions.net/testPrompt"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/testPrompt";
