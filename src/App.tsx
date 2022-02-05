import React, { useEffect, useState } from "react";
// import the css
import "./App.css";
import dbCall from "./helpers/Environments";

// import packages
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import the components
import Home from "../src/components/Home";
import Login from "../src/components/Login";
import Navbar from "../src/components/Navbar";
import Register from "../src/components/Register";
import VideoPost from "../src/components/VideoPost";

export interface ABCtoken {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (value: boolean) => void;
  clearToken: () => void;
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  updateToken: (mintToken: string) => void;
}

export interface ABCuserInfo {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  id: string;
  setId: (id: string) => void;
}

export interface ABCcalls {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  fetchDb: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  responseStatus: number;
  setResponseStatus: (responseStatus: number) => void;
  // mountyPython: boolean,
}

// Did not use React.FunctionComponent as per (https://github.com/typescript-cheatsheets/react/blob/main/README.md#basic-cheatsheet-table-of-contents) this methology is deprecated.

const App = () => {
  const [id, setId] = useState<ABCuserInfo["id"]>("");
  const [isAdmin, setIsAdmin] = useState<ABCuserInfo["isAdmin"]>(false);
  const [emailAddress, setEmailAddress] =
    useState<ABCuserInfo["emailAddress"]>("");
  const [errorMessage, setErrorMessage] =
    useState<ABCcalls["errorMessage"]>("");
  // const [mountyPython, setMountyPython] = useState<ABCcalls['mountyPython']>(false);
  const [responseStatus, setResponseStatus] =
    useState<ABCcalls["responseStatus"]>(500);
  const [sessionToken, setSessionToken] =
    useState<ABCtoken["sessionToken"]>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] =
    useState<ABCtoken["isUserLoggedIn"]>(false);
  const [username, setUsername] = useState<ABCuserInfo["username"]>("");

  //! fetching all videos, regardless of validation.
  //! sort by newest first.
  const fetchVideos = async () => {
    const response = await fetch(`${dbCall}/videos/content/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setResponseStatus(response.status);
    setErrorMessage(data.errorMessage);
  };

  // const fetchDb = async (): Promise<void> => {
  //   if (localStorage.getItem('Authorization') === null) {
  //     setSessionToken(null);
  //   }
  //   else {
  //     setSessionToken(localStorage.getItem('Authorization'));
  //   }
  //   await fetch(`${dbCall}/users/validate`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${sessionToken}`
  //     }
  //   })
  //   .then(res => {
  //     console.log("AppAuth res.status is ", res.status);
  //     setResponseStatus(res.status);
  //     return res.json();
  //   })
  //   .then(data => {
  //     console.log("AppAuth data is ", data);
  //     if (data.status === 200) {
  //       setIsUserLoggedIn(true);
  //       setId(data.user.id);
  //       setIsAdmin(data.user.isAdmin);
  //       setEmailAddress(data.user.emailAddress);
  //       setUsername(data.user.username);
  //     }
  //     else {
  //       setIsUserLoggedIn(false);
  //       setId('');
  //       setIsAdmin(false);
  //       setEmailAddress('');
  //       setUsername('');
  //     }
  //   })
  //   .catch(err => {
  //     console.log("AppAuth err is ", err);
  //     setIsUserLoggedIn(false);
  //     setId('');
  //     setIsAdmin(false);
  //     setEmailAddress('');
  //     setUsername('');
  //   });
  // }

  const updateToken = (mintToken: string): void => {
    localStorage.setItem("Authorization", mintToken);
    setSessionToken(mintToken);
  };

  const clearToken = (): void => {
    localStorage.removeItem("sessionToken");
    setSessionToken(null);
    updateToken("");
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    // fetchDb();
    fetchVideos();
  });

  return (
    <>
      <Navbar>
        clearToken={clearToken}
        emailAddress={emailAddress}
        sessionToken={sessionToken}
        setSessionToken={setSessionToken}
        isUserLoggedIn={isUserLoggedIn}
        username={username}
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <Login
              id={id}
              setId={setId}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              emailAddress={emailAddress}
              setEmailAddress={setEmailAddress}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              responseStatus={responseStatus}
              setResponseStatus={setResponseStatus}
              sessionToken={sessionToken}
              setSessionToken={setSessionToken}
              updateToken={updateToken}
              isUserLoggedIn={isUserLoggedIn}
              setIsUserLoggedIn={setIsUserLoggedIn}
              username={username}
              setUsername={setUsername}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Register
              id={id}
              setId={setId}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              emailAddress={emailAddress}
              setEmailAddress={setEmailAddress}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              isUserLoggedIn={isUserLoggedIn}
              setIsUserLoggedIn={setIsUserLoggedIn}
              responseStatus={responseStatus}
              setResponseStatus={setResponseStatus}
              sessionToken={sessionToken}
              setSessionToken={setSessionToken}
              updateToken={updateToken}
              username={username}
              setUsername={setUsername}
            />
          }
        />

        <Route
          path="/videos/content"
          element={<VideoPost isAdmin={isAdmin} sessionToken={sessionToken} />}
        />
      </Routes>
    </>
  );
};

export default App;
