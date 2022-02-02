import React, { useEffect, useState } from 'react';
// import the css
import './App.css';
import dbCall from './helpers/Environments';

// import packages
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import the components
// import Home from '../src/components/Home';
import Login from '../src/components/Login';
import Navbar from '../src/components/Navbar';
import Register from '../src/components/Register';


export type ABCtoken = {
  isUserLoggedIn: boolean;
  clearToken: () => void;
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  updateToken: (mintToken: string) => void;
}

export type ABCuserInfo = {
  isAdmin: boolean;
  emailAddress: string;
  username: string;
  id: string;
  passwordhash: string,
}

export type ABCcalls = {
  errorMessage: string;
  fetchDb: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  responseStatus: number;
  mountyPython: boolean,
}

// Did not use React.FunctionComponent as per (https://github.com/typescript-cheatsheets/react/blob/main/README.md#basic-cheatsheet-table-of-contents) this methology is deprecated.

const App = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [mountyPython, setMountyPython] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number>(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | null>('');
  const [username, setUsername] = useState<string>('');
  

  //! fetching all videos, regardless of validation. 
  //! sort by newest first.
  const fetchVideos = async () => {
    const response = await fetch(`${dbCall}/videos/content/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setResponseStatus(response.status);
    setErrorMessage(data.errorMessage);
    setMountyPython(true);
  }

  const fetchDb = async (): Promise<void> => {
    if (localStorage.getItem('Authorization') === null) {
      setSessionToken(null);
    }
    else {
      setSessionToken(localStorage.getItem('Authorization'));
    }
    const response = await fetch(`${dbCall}/users/validate`, {
      method: 'POST',
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
      setEmailAddress(responseJson.email);
      setUsername(responseJson.username);
      setId(responseJson.id);
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
    setSessionToken(mintToken);
  }

  const clearToken = (): void => {
    localStorage.removeItem('sessionToken');
    setSessionToken(null);
    updateToken('');
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    fetchDb();
    fetchVideos();
  });
  
  return (
    <>
      <Router>
        <Navbar>
          clearToken={clearToken}
          emailAddress={emailAddress}
          sessionToken={sessionToken}
          setSessionToken={setSessionToken}
          isUserLoggedIn={isUserLoggedIn}
          username={username}
        </Navbar>

        
          <Routes>
            {/* <Route path="/" element={<Home
              isAdmin={isAdmin}
            />} /> */}
            <Route path="/login" element={<Login
              id={id}
              isAdmin={isAdmin}
              emailAddress={emailAddress}
              errorMessage={errorMessage}
              responseStatus={responseStatus}
              sessionToken={sessionToken}
              setSessionToken={setSessionToken}
              updateToken={updateToken}
              username={username}
            />} />

            <Route path="/register" element={<Register
              id={id}
              isAdmin={isAdmin}
              emailAddress={emailAddress}
              errorMessage={errorMessage}
              isUserLoggedIn={isUserLoggedIn}
              responseStatus={responseStatus}
              sessionToken={sessionToken}
              setSessionToken={setSessionToken}
              updateToken={updateToken}
              username={username}
            />} />
          </Routes>
      </Router>
    </>
  );
}

export default App;