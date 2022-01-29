import React, { useEffect, useState } from 'react';
// import the css
import './App.css';
import { dbCall } from './helpers/Environments';

// import packages
import { BrowserRouter as Route, Routes } from 'react-router-dom';
// import the components

import Home from '../src/components/Home';
import Login from '../src/components/Login';
import Navbar from '../src/components/Navbar';
import Register from '../src/components/Register';

export interface ABCtoken {
  isUserLoggedIn: boolean;
  clearToken: () => void;
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  updateToken: (mintToken: string) => void;
}

export interface ABCuserInfo {
  isAdmin: boolean;
  emailAddress: string;
  username: string;
}

export interface ABCcalls {
  dbCall: string;
  errorMessage: string;
  fetchDb: () => Promise<void>;
  responseStatus: number;
}


// Did not use React.FunctionComponent as per (https://github.com/typescript-cheatsheets/react/blob/main/README.md#basic-cheatsheet-table-of-contents) this methology is deprecated.

const App = (props: ABCtoken & ABCuserInfo & ABCcalls) => { 
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number>(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | null>('');
  const [username, setUsername] = useState<string>('');

  const fetchDb = async (): Promise<void> => {
    if (localStorage.getItem('Authorization') === null) {
      props.setSessionToken(null);
    }
    else {
      props.setSessionToken(localStorage.getItem('Authorization'));
    }
    const response = await fetch(`${props.dbCall}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      }
    });
    const responseJson = await response.json();
    setResponseStatus(response.status);
    if (response.status === 200) {
      setIsUserLoggedIn(true);
      setIsAdmin(responseJson.isAdmin);
      setEmailAddress(responseJson.emailAddress);
      setUsername(responseJson.username);
    }
    else {
      setIsUserLoggedIn(false);
      setIsAdmin(false);
      setEmailAddress('');
      setUsername('');
    }
  }

  const updateToken = (mintToken: string): void => {
    localStorage.setItem('Authorization', mintToken);
    props.setSessionToken(mintToken);
  }

  const clearToken = (): void => {
    localStorage.removeItem('sessionToken');
    props.setSessionToken(null);
    props.updateToken('');
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    fetchDb();
  });
  
    return (
      <>
        <Navbar>
          clearToken={clearToken}
          emailAddress={emailAddress}
          sessionToken={props.sessionToken}
          setSessionToken={props.setSessionToken}
          isUserLoggedIn={isUserLoggedIn}
          username={username}
        </Navbar>

        <Routes>
          <Route path="/" element={<Home
              isUserLoggedIn={isUserLoggedIn}
              isAdmin={isAdmin}
              emailAddress={emailAddress}
              username={username}
            />} />
          
          <Route path="/login" element={<Login
              updateToken={updateToken}
              sessionToken={props.sessionToken}
              setSessionToken={props.setSessionToken}
            />} />

          <Route path="/register" element={<Register
              updateToken={updateToken}
              sessionToken={props.sessionToken}
              setSessionToken={props.setSessionToken}
            />} />
        </Routes>
      </>
    );
}


