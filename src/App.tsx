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
import Settings from "../src/components/Settings";
import Logout from "../src/components/Logout";

export interface ABCtoken {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (value: boolean) => void;
  clearToken: () => void;
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  updateToken: (mintToken: string) => void;
}

export interface ABCuserInfo {
	id: string;
	isAdmin: boolean | null;
	setIsAdmin: (isAdmin: boolean | null) => void;
	emailAddress: string;
	setEmailAddress: (email: string) => void;
	username: string;
	setUsername: (username: string) => void;
	setId: (id: string) => void;
}

export interface ABCcalls {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  fetchDb: () => Promise<void>;
  
  responseStatus: number;
  setResponseStatus: (responseStatus: number) => void;
}

export interface ABCvideo {
  videoId: string;
  setVideoId: (videoId: string) => void;
  videoTitle: string;
  setVideoTitle: (videoTitle: string) => void;
  videoLink: string;
  setVideoLink: (videoLink: string) => void;
	// thumbnailImage: string;
	// playersHighlighted: playersHighlightedArray[];
	// teamsFeatured: teamsFeaturedArray[];
	// tags: tagsArray[];
	// gameDate: Date;
	// nbaSeason: string;
	// isPlayoffs: boolean;
	// clutch: boolean;
	// adminHighlighted: boolean;
	// adminDelete: boolean;
}

// Did not use React.FunctionComponent as per (https://github.com/typescript-cheatsheets/react/blob/main/README.md#basic-cheatsheet-table-of-contents) this methology is deprecated.

const App = () => {
  //! userInfo States
  const [id, setId] = useState<ABCuserInfo["id"]>("");
  const [isAdmin, setIsAdmin] = useState<ABCuserInfo["isAdmin"]>(false);
  const [emailAddress, setEmailAddress] = useState<ABCuserInfo["emailAddress"]>("");
  const [username, setUsername] = useState<ABCuserInfo["username"]>("");
  //! calls States
  const [errorMessage, setErrorMessage] = useState<ABCcalls["errorMessage"]>("");
  const [responseStatus, setResponseStatus] = useState<ABCcalls["responseStatus"]>(500);
  //! token States
  const [sessionToken, setSessionToken] = useState<ABCtoken["sessionToken"]>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<ABCtoken["isUserLoggedIn"]>(false);
  //! video States
  const [videoId, setVideoId] = useState<ABCvideo["videoId"]>("");
  const [videoTitle, setVideoTitle] = useState<ABCvideo["videoTitle"]>("");
  const [videoLink, setVideoLink] = useState<ABCvideo["videoLink"]>("");


  const fetchDb = async (): Promise<void> => {
    if (localStorage.getItem('Authorization')) {
      setSessionToken(localStorage.getItem('Authorization'));
      setIsUserLoggedIn(true);
    }

    if (sessionToken !== null || undefined || "") {
      await fetch(`${dbCall}/users/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        }
      })
        .then(res => {
          return res.json()
        })
        .then((data) => {
          console.log("App Validation :", data);
          setId(data.id);
          setIsAdmin(data.isAdmin);
          setEmailAddress(data.email);
          setErrorMessage(data.message);
          setUsername(data.username);
          if (data.status === 200) {
            setIsUserLoggedIn(true);
          }
        })
        .catch(err => {
          console.log(err);
          setIsUserLoggedIn(false);
          setErrorMessage(err.message);
          setId("");
          setIsAdmin(false);
          setEmailAddress("");
          setUsername("");
        });
    } else {
      setIsUserLoggedIn(false);
      setId("");
      setIsAdmin(false);
      setEmailAddress("");
      setUsername("");
    }
  }

  const updateToken = (mintToken: string): void => {
    localStorage.setItem("Authorization", mintToken);
    setSessionToken(mintToken);
  };

  const clearToken = (): void => {
    localStorage.removeItem("sessionToken");
    setSessionToken(null);
    updateToken("");
    setIsUserLoggedIn(false);
    setId("");
    setIsAdmin(false);
    setEmailAddress("");
    setUsername("");
  };

  useEffect(() => {
    fetchDb();
  }, [sessionToken]);

  return (
		<>
			<Navbar
				isAdmin={isAdmin}
				clearToken={clearToken}
				emailAddress={emailAddress}
				id={id}
				sessionToken={sessionToken}
				setSessionToken={setSessionToken}
				isUserLoggedIn={isUserLoggedIn}
				username={username}
			/>

			<Routes>
				<Route
					path="/"
					element={
						<Home
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							responseStatus={responseStatus}
							setResponseStatus={setResponseStatus}
							isUserLoggedIn={isUserLoggedIn}
							sessionToken={sessionToken}
							videoId={videoId}
							videoTitle={videoTitle}
							videoLink={videoLink}
						/>
					}
				/>

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

				<Route path="/logout" element={<Logout clearToken={clearToken} />} />

				<Route
					path={`/settings/`}
					element={
						<Settings
							clearToken={clearToken}
							id={id}
							emailAddress={emailAddress}
							setEmailAddress={setEmailAddress}
							sessionToken={sessionToken}
							username={username}
							setUsername={setUsername}
							responseStatus={responseStatus}
							setResponseStatus={setResponseStatus}
						/>
					}
				/>

				<Route
					path="/videos/content"
					element={
						<VideoPost
							isAdmin={isAdmin}
							sessionToken={sessionToken}
							setVideoId={setVideoId}
							setVideoTitle={setVideoTitle}
              setVideoLink={setVideoLink}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
						/>
					}
				/>
			</Routes>
		</>
	);
};

export default App;
