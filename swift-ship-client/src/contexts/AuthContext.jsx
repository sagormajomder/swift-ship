import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@firebase/auth';
import { createContext, use, useEffect, useState } from 'react';
import auth from './../firebase/firebase.config';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(user);

  // User Register
  function registerUser(email, password) {
    setIsLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // User Signin
  function signInUser(email, password) {
    setIsLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }

  // User SignOUt
  function signOutUser() {
    return signOut(auth);
  }

  // Auth Observer
  useEffect(function () {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext
      value={{
        registerUser,
        signInUser,
        signOutUser,
        isLoading,
        setIsLoading,
        user,
        setUser,
      }}>
      {children}
    </AuthContext>
  );
}

function useAuth() {
  const context = use(AuthContext);

  if (!context) throw new Error('Auth Context was used outside Auth Provider');

  return context;
}

export { AuthProvider, useAuth };
