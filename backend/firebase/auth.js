import { auth } from "./config";

export const signUp = (email, password) =>
  auth().createUserWithEmailAndPassword(email, password);

export const signIn = (email, password) =>
  auth().signInWithEmailAndPassword(email, password);

export const getUserID = () =>
  auth().currentUser.uid;

export const signOut = () => auth().signOut();