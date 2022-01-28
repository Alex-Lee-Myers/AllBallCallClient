import React, { useEffect, useState } from 'react';
// import the css
import './App.css';
import { Login } from '../src/components/Login';
// import { Register } from '../src/components/Register';
// import the components
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import Home from './components/home';
import Home from '../src/components/Home';
import Navbar from '../src/components/Navbar';

export type ABCProps = {
  isAdmin: boolean,
  dbCall: string;
  clearToken: () => void,
  emailAddress: string,
  errorMessage: string,
  fetchDb: () => Promise<void>,
  handleChange (event: React.ChangeEvent<HTMLInputElement>): void,
  handleSubmit (event: React.FormEvent<HTMLFormElement>): void,
  isLoggedIn: boolean,
  mountyPython: boolean,
  passwordhash: string,
  responseStatus: number,
  sessionToken: string | null,
  setSessionToken: (sessionToken: string | null) => void,
  updateToken: (newToken: string) => void,
  username: string | null,
  uuid: string | null,
}

export const App: React.FunctionComponent<{
  isAdmin: boolean,
  dbCall: string,
  clearToken: () => void,
  emailAddress: string,
  errorMessage: string,
  fetchDb: () => Promise<void>,
  handleChange (event: React.ChangeEvent<HTMLInputElement>): void,
  handleSubmit (event: React.FormEvent<HTMLFormElement>): void,
  isLoggedIn: boolean,
  mountyPython: boolean,
  passwordhash: string,
  responseStatus: number,
  sessionToken: string | null,
  setSessionToken: (sessionToken: string | null) => void,
  updateToken: (newToken: string) => void,
  username: string | null,
  uuid: string | null,
}> = (props: ABCProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mountyPython, setMountyPython] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number>(0);
  const [sessionToken, setSessionToken] = useState<string | null>('');
  const [uuid, setUuid] = useState<string | null>('');
  const [username, setUsername] = useState<string | null>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [passwordhash, setPasswordhash] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dbCall, setDbCall] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value;
    switch (target.name) {
      case 'emailAddress':
        setEmailAddress(value);
        break;
      case 'passwordhash':
        setPasswordhash(value);
        break;
      default:
        break;
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setResponseStatus(0);
    setSessionToken('');
    setUuid('');
    setUsername('');
    setIsAdmin(false);
    setDbCall('');
    setIsLoggedIn(false);
    setMountyPython(false);
    props.clearToken();
    props.fetchDb()

      .then(() => {
        const user = props.username;
        const uuid = props.uuid;
        const isAdmin = props.isAdmin;

        if (user && uuid) {

          setIsLoggedIn(true);
          setUsername(user);
          setUuid(uuid);
          setIsAdmin(isAdmin);
          setSessionToken(props.sessionToken);
          setDbCall(props.dbCall);
          setMountyPython(true);
        } else {  // if the user is not logged in
          setErrorMessage('Invalid username or password');
          setResponseStatus(401);

        }

      })
      .catch((error) => {
        setErrorMessage(error.message);
        setResponseStatus(500);
      });
  }

  useEffect(() => {
    fetchDb()
  }, [sessionToken]);





    return (
      <div className="App">
        <Navbar>
          {/* clearSessionToken={clearSessionToken}
          setSessionToken={setSessionToken}
          sessionToken={sessionToken}
          isLoggedIn={isLoggedIn} */}
        </Navbar>

          <Login>
            isAdmin={isAdmin}
            dbCall={dbCall}
            fetchDb={fetchDb}
            emailAddress={emailAddress}
            errorMessage={errorMessage}
            isLoggedIn={isLoggedIn}
            mountyPython={mountyPython}
            passwordhash={passwordhash}
            responseStatus={responseStatus}
            sessionToken={sessionToken}
            setSessionToken={setSessionToken}
            updateToken={updateToken}
            username={username}
            handleChange={handleChange}
            handleSubmit={handleSubmit}

          </Login>
      </div>
    );
  }

