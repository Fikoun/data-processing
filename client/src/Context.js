import React, { useState, createContext } from 'react';
import Auth from './Auth';

export const Context = createContext([]);

export function AuthProvider(props) {

  const context = useState({ user:null, token: localStorage.getItem('token') });

  const auth = new Auth(context)

  return (
    <Context.Provider value={ auth }>
      {props.children}
    </Context.Provider>
  );
}


