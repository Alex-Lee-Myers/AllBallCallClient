//import interfaces from App.tsx
import { ABCtoken, ABCuserInfo, ABCcalls } from "../App";
import dbCall from "../helpers/Environments";
import { useNavigate, Link } from "react-router-dom";
import React, { Component } from "react";
// import loginSplash.jpg and allballcall-500.svg from src/images
import registerSplash from "../images/registerSplash.jpg";
import allballcall_500 from "../images/allballcall-logo-500-black-text.svg";

type RegisterState = {
  id: ABCuserInfo["id"];
  isAdmin: ABCuserInfo["isAdmin"];
  emailAddress: ABCuserInfo["emailAddress"];
  errorMessage: ABCcalls["errorMessage"];
  isUserLoggedIn: ABCtoken["isUserLoggedIn"];
  responseStatus: ABCcalls["responseStatus"];
  sessionToken: ABCtoken["sessionToken"];
  setSessionToken: ABCtoken["setSessionToken"];
  updateToken: ABCtoken["updateToken"];
  username: ABCuserInfo["username"];
};


//TODO 0) SessionToken / states not being assigned correctly. Fix.
//TODO 1) Add verification prompts surrounding the fields.
//TODO 2) Test if Admin endpoint is working. 

//! Function version
const Register = (props: RegisterState) => {
  //! Navigate for React-Router-Dom V6
  const navigate = useNavigate();
  //! UseState's
  const [emailAddress, setEmailAddress] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [passwordhash, setPasswordhash] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [accountResetQuestion1, setAccountResetQuestion1] = React.useState<string>("");
  const [accountResetQuestion2, setAccountResetQuestion2] = React.useState<string>("");
  const [accountResetAnswer1, setAccountAnswer1] = React.useState<string>("");
  const [accountResetAnswer2, setAccountAnswer2] = React.useState<string>("");
  const [sessionToken, setSessionToken] = React.useState<string | null>("");
  const [updateToken, setUpdateToken] = React.useState<ABCtoken["updateToken"]>();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [mountyPython, setMountyPython] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [responseStatus, setResponseStatus] = React.useState<number>(0);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState<boolean>(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [adminPassword, setAdminPassword] = React.useState<string>("");
  const [isAdminFieldVisible, setIsAdminFieldVisible] = React.useState<boolean>(false);

  //! Validation Fields

  //? Email Address
  const emailAddressValidation = () => {
    if (emailAddress.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
      return "Invalid email address!";
    }
    return true;
  };

  //? Password
  const passwordValidation = () => {
    if (passwordhash.length < 5) {
      return "Password must be at least 5 characters!";
    }
    return true;
  };

  //? Password Confirmation
  const passwordConfirmationValidation = () => {
    if (passwordhash !== confirmPassword) {
      return "Passwords do not match!";
    }
    return true;
  };

  //? Username
  const usernameValidation = () => {
    if (username.length < 3) {
      return "Username must be at least 3 characters!";
    }
    return true;
  };

  //? Validate all fields
  const validateAllFields = () => {
    if (
        emailAddressValidation() === true &&
        passwordValidation() === true &&
        passwordConfirmationValidation() === true &&
        usernameValidation() === true
    ) {
        return true;
    }
    return false;
};

  //? Set "isAdminFieldVisible" to true, if they select the "Admin" checkbox. if they unselect it, set it to false.
    const handleAdminCheckbox = () => {
        if (isAdminFieldVisible === false) {
            setIsAdminFieldVisible(true);
    } else {
        setIsAdminFieldVisible(false);
        }
    };

  //? If the server returns a 200, the user isAdmin will be set to true.
  //? If the server returns a 401, the user isAdmin will be set to false, and don't let the user register.
  //? If the server returns a 500, the user isAdmin will be set to false, and don't let the user register.
  //? Tell them to attempt the Admin password again or leave the Admin password field blank to not register as an Admin.

  //? If the user isAdmin is true, they will be redirected to the Admin Dashboard.
  //? If the user isAdmin is false, they will be redirected to the User Dashboard.
    const redirectToDashboard = () => {
        if (isAdmin === true) {
        navigate("/admin");
        } else {
        navigate("/");
        }
    };

  //?

  const registerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "emailAddress") {
      setEmailAddress(event.target.value);
    } else if (event.target.id === "passwordhash") {
      setPasswordhash(event.target.value);
    } else if (event.target.id === "confirmPassword") {
      setConfirmPassword(event.target.value);
    } else if (event.target.id === "username") {
      setUsername(event.target.value);
    } else if (event.target.id === "adminPassword") {
      setAdminPassword(event.target.value);
    } else if (event.target.id === "accountResetQuestion1") {
      setAccountResetQuestion1(event.target.value);
    } else if (event.target.id === "accountResetQuestion2") {
      setAccountResetQuestion2(event.target.value);
    } else if (event.target.id === "accountResetAnswer1") {
      setAccountAnswer1(event.target.value);
    } else if (event.target.id === "accountResetAnswer2") {
      setAccountAnswer2(event.target.value);
    }
  };

  const registerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // postgresql database call
    if (validateAllFields() === true) {
      const response = await fetch(`${dbCall}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: {
            username: username,
            email: emailAddress,
            passwordhash: passwordhash,
            isAdmin: isAdmin,
            adminPassword: adminPassword,
            accountResetQuestion1: accountResetQuestion1,
            accountResetQuestion2: accountResetQuestion2,
            accountResetAnswer1: accountResetAnswer1,
            accountResetAnswer2: accountResetAnswer2
            }
        }),
      });
      const data = await response.json();
      console.log("Register Data:", data);
      if (response.status === 200) {
        setSessionToken(data.sessionToken);
        setUpdateToken(data.updateToken);
        setIsLoggedIn(true);
        setIsAdmin(data.isAdmin);
        setIsUserLoggedIn(true);
        setErrorMessage("");
        setResponseStatus(response.status);
        navigate("/");
      } else if (response.status === 401) {
        setIsAdmin(false);
        setIsUserLoggedIn(false);
        setErrorMessage("");
        setResponseStatus(response.status);
        redirectToDashboard();
      } else if (response.status === 500) {
        setIsAdmin(false);
        setIsUserLoggedIn(false);
        setErrorMessage("");
        setResponseStatus(response.status);
        redirectToDashboard();
      }
    } else {
      setErrorMessage("Please fix the errors in the form.");
    }
  };

  return (
    <div className="z-index-10 flex pb-4">
      <div className="h-screen flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20
     xl:px-24 overflow-y-auto ">
        <div className="z-index-10 mx-auto w-full max-w-sm h-full">
        <div>
            <img
                className="h-12 w-auto"
                src={allballcall_500}
                alt="AllBallCall"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-right">
                Register and call your own shots.
            </h2>
            <p className="mt-2 text-sm text-gray-600 mb-10">
              or {/* register */}
                <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Already in our lineup? Sign-in.
                </Link>
            </p>
        </div>
          {/* Username */}
          <form className="space-y-6" onSubmit={registerSubmit}>
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/*! Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="passwordhash"
                  name="passwordhash"
                  type="password"
                  value={passwordhash}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* ConfirmPassword */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Account Reset Question 1 */}
            <div className="space-y-1">
              <label
                htmlFor="accountResetQuestion1"
                className="block text-sm font-medium text-gray-700"
              >
                Account Reset Question 1
              </label>
              <div className="mt-1">
                <input
                  id="accountResetQuestion1"
                  name="accountResetQuestion1"
                  type="text"
                  value={accountResetQuestion1}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Account Reset Answer 1 */}
            <div className="space-y-1">
              <label
                htmlFor="accountResetAnswer1"
                className="block text-sm font-medium text-gray-700"
              >
                Account Reset Answer 1
              </label>
              <div className="mt-1">
                <input
                  id="accountResetAnswer1"
                  name="accountResetAnswer1"
                  type="text"
                  value={accountResetAnswer1}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Account Reset Question 1 */}
            <div className="space-y-1">
              <label
                htmlFor="accountResetQuestion2"
                className="block text-sm font-medium text-gray-700"
              >
                Account Reset Question 2
              </label>
              <div className="mt-1">
                <input
                  id="accountResetQuestion2"
                  name="accountResetQuestion2"
                  type="text"
                  value={accountResetQuestion2}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Account Reset Answer 2 */}
            <div className="space-y-1">
              <label
                htmlFor="accountResetAnswer2"
                className="block text-sm font-medium text-gray-700"
              >
                Account Reset Answer 2
              </label>
              <div className="mt-1">
                <input
                  id="accountResetAnswer2"
                  name="accountResetAnswer2"
                  type="text"
                  value={accountResetAnswer2}
                  onChange={registerChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Admin Radio Button. If turned on, set isAdminFieldVisible to true with isAdminFieldVisibleTrue function, and show admin password field. */}
            <div className="space-y-1">
              <div className="flex items-center">
                <input
                  id="isAdminFieldVisible"
                  name="isAdminFieldVisible"
                  type="checkbox"
                  checked={isAdminFieldVisible}
                  onChange={handleAdminCheckbox}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label
                  htmlFor="isAdminFieldVisible"
                  className="ml-2 block text-sm leading-5 text-gray-700"
                >
                  Admin?
                </label>
              </div>
              {isAdminFieldVisible && (
                <div className="mt-1">
                  <label
                    htmlFor="adminPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Authorization Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="adminPassword"
                      name="adminPassword"
                      type="password"
                      required
                      value={adminPassword}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-screen w-full object-cover"
          // import registerSplash.jpg
          src={registerSplash}
          alt=""
        />
      </div>
    </div>
  );
};

export default Register;
