// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { writable, derived } from "svelte/store";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClviEz4AIgWIcLIKcILHTRkYkbzhpaqPw",
  authDomain: "aff-tracker-f583e.firebaseapp.com",
  projectId: "aff-tracker-f583e",
  storageBucket: "aff-tracker-f583e.firebasestorage.app",
  messagingSenderId: "82798426017",
  appId: "1:82798426017:web:c71451fe9489b5d6e5bde0",
  measurementId: "G-LHGH7C52BD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const analytics = getAnalytics(app);

export const sendMagicLink = (email: string, redirectUrl: string) => {
  const actionCodeSettings = {
    url: redirectUrl,
    handleCodeInApp: true,
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

//////user store//////

const userStore = () => {
  let unsubscribe = () => {};

  if (!auth || !globalThis.window) {
    console.warn("auth or window is not defined");

    const { subscribe } = writable(null);

    return {
      subscribe,
    };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });
  return {
    subscribe,
  };
};

////////Doc store////////
export const docStore = (path: string) => {
  let unsubscribe = () => {};
  const docRef = doc(db, path);

  const { subscribe } = writable<DocumentData | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (doc) => {
      set(doc.data() ?? null);
    });
    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
};
export default docStore;
export const user = userStore();
export const userData = derived(user, ($user, set) => {
  if ($user) {
    return docStore(`users/${$user.uid}`).subscribe(set);
  } else {
    set(null);
  }
});
