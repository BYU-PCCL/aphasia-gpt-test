import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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

const isProduction = process.env.NODE_ENV === "production";

// See the deployed function URLs in the Firebase console (https://console.firebase.google.com)
// Cases
export const SET_TEST_CASE_API_ENDPOINT = isProduction
  ? "https://settestcase-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/setTestCase";
export const GET_ALL_TEST_CASES_API_ENDPOINT = isProduction
  ? "https://getalltestcases-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/getAllTestCases";
export const DELETE_TEST_CASE_API_ENDPOINT = isProduction
  ? "https://deletetestcase-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/deleteTestCase";
// Prompts
export const GET_ALL_PROMPTS_API_ENDPOINT = isProduction
  ? "https://getallprompts-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/getAllPrompts";
export const SET_PROMPT_API_ENDPOINT = isProduction
  ? "https://setprompt-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/setPrompt";
export const DELETE_PROMPT_API_ENDPOINT = isProduction
  ? "https://deleteprompt-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/deletePrompt";
// Tests
export const GET_ALL_TESTS_API_ENDPOINT = isProduction
  ? "https://getalltests-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/getAllTests";
export const START_PROMPT_TESTS_API_ENDPOINT = isProduction
  ? "https://startprompttests-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/startPromptTests";
export const RETRY_PROMPT_TESTS_API_ENDPOINT = isProduction
  ? "https://retryprompttests-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/retryPromptTests";
export const DELETE_TEST_RESULT_API_ENDPOINT = isProduction
  ? "https://deletetestresult-hzvkkbfdsa-uc.a.run.app"
  : "http://127.0.0.1:5000/brocas-userdb/us-central1/deleteTestResult";
