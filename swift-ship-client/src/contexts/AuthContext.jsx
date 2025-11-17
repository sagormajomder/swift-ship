import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from '@firebase/auth';
import { createContext, use, useEffect, useState } from 'react';
import auth from './../firebase/firebase.config';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(user);

  function registerUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
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
      value={{ registerUser, isLoading, setIsLoading, user, setUser }}>
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
