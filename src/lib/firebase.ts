// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import{ getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";
import type { Readable } from "svelte/motion";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSaCPE2S5wtyDrzUdcfKgPaDRWWV1nDEo",
  authDomain: "svelte-links-123.firebaseapp.com",
  projectId: "svelte-links-123",
  storageBucket: "svelte-links-123.appspot.com",
  messagingSenderId: "40078041420",
  appId: "1:40078041420:web:f47a6d07aeb5017d882fe9",
  measurementId: "G-4PXG42BBMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();


function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => { 
  if ($user) {
    return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
  } else {
    set(null); 
  }
}); 