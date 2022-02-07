import { ABCtoken, ABCuserInfo, ABCcalls } from "../App";
import dbCall from "../helpers/Environments";
import { useNavigate, Link } from "react-router-dom";
import React from "react";
import registerSplash from "../images/registerSplash.jpg";
import allballcall_500 from "../images/allballcall-logo-500-black-text.svg";


export interface AuthProps {
  id: ABCuserInfo["id"];
  setId: ABCuserInfo["setId"];
  isAdmin: ABCuserInfo["isAdmin"];
  setIsAdmin: ABCuserInfo["setIsAdmin"];
  emailAddress: ABCuserInfo["emailAddress"];
  setEmailAddress: ABCuserInfo["setEmailAddress"];
  errorMessage: ABCcalls["errorMessage"];
  setErrorMessage: ABCcalls["setErrorMessage"];
  responseStatus: ABCcalls["responseStatus"];
  setResponseStatus: ABCcalls["setResponseStatus"];
  sessionToken: ABCtoken["sessionToken"];
  setSessionToken: ABCtoken["setSessionToken"];
  updateToken: ABCtoken["updateToken"];
  isUserLoggedIn: ABCtoken["isUserLoggedIn"];
  setIsUserLoggedIn: ABCtoken["setIsUserLoggedIn"];
  username: ABCuserInfo["username"];
  setUsername: ABCuserInfo["setUsername"];
}

//TODO 0) SessionToken / states not being assigned correctly. Fix.
//TODO 1) Add verification prompts surrounding the fields.
//TODO 2) Test if Admin endpoint is working.
//TODO 3) Customize scrollbar.

//! Function version
const Register = (props: AuthProps) => {
  //! Navigate for React-Router-Dom V6
  const navigate = useNavigate();
  //! UseState's
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [passwordhash, setPasswordhash] = React.useState<string>("");
  const [accountResetQuestion1, setAccountResetQuestion1] = React.useState<string>("");
  const [accountResetQuestion2, setAccountResetQuestion2] = React.useState<string>("");
  const [accountResetAnswer1, setAccountAnswer1] = React.useState<string>("");
  const [accountResetAnswer2, setAccountAnswer2] = React.useState<string>("");
  const [adminPassword, setAdminPassword] = React.useState<string>("");
  const [isAdminFieldVisible, setIsAdminFieldVisible] = React.useState<boolean>(false);

  //! Validation Fields

  //? Email Address
  const emailAddressValidation = () => {
    if (
      props.emailAddress.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
    ) {
      console.log("Email Address is invalid");
      return ["Invalid email address!", false];
    }
    return true;
  };

  //? Password
  const passwordValidation = () => {
    if (passwordhash.length < 5) {
      console.log("Password must be at least 5 characters!");
      return "Password must be at least 5 characters!";
    }
    return true;
  };

  //? Password Confirmation
  const passwordConfirmationValidation = () => {
    if (passwordhash !== confirmPassword) {
      console.log("Passwords do not match!");
      return "Passwords do not match!";
    }
    return true;
  };

  //? Username
  const usernameValidation = () => {
    if (props.username.length < 3) {
      console.log("Username must be at least 3 characters!");
      return "Username must be at least 3 characters!";
    }
    return true;
  };

  //? Admin Password (if admin)
  //* If they leave the adminPassword field blank, set isAdmin to false.
  //* If they type in the password from process.env.ADMIN_PW_VALUE incorrectly, set isAdmin to false, display error message, set errorMessage to "Incorrect admin password. Please leave this field blank if you wish to register as a standard user or try again.", and keep the user on the page.
  //* If they type in the password from process.env.ADMIN_PW_VALUE correctly, set isAdmin to true.

  const AdminPasswordValidation = () => {
    if (adminPassword.length === 0) {
      console.log("Admin password field is empty! Registering as standard user.");
      props.setIsAdmin(false);
        return null;
    }
    else if (adminPassword !== process.env.REACT_APP_ADMIN_PW_VALUE) {
      console.log("Incorrect admin password! Try again/blank it out.");
        props.setIsAdmin(null)
        props.setErrorMessage(
          "Incorrect admin password. Please try again or leave this field blank if you wish to register as a standard user."
        );
        return false;
      }
    else if (adminPassword === process.env.REACT_APP_ADMIN_PW_VALUE) {
      console.log("Correct admin password!");
      props.setIsAdmin(true);
        return true;
    }
  };

  //? Validate all fields
  const validateAllFields = () => {
    if (
      emailAddressValidation() === true &&
      passwordValidation() === true &&
      passwordConfirmationValidation() === true &&
      usernameValidation() === true &&
      AdminPasswordValidation() === true)
    {
        return [true, "Admin user succesfully registered!", "You are now logged in as an admin!"];
    }
    else if (
      emailAddressValidation() === true &&
      passwordValidation() === true &&
      passwordConfirmationValidation() === true &&
      usernameValidation() === true &&
      AdminPasswordValidation() === null)
    {
        return [true, "Standard user succesfully registered!"];
    }
    else {
        return [false, "Registration failed. Please validate all the fields."];
    }
  };

  //? Set "isAdminFieldVisible" to true, if they select the "Admin" checkbox. if they unselect it, set it to false.
  const handleAdminCheckbox = () => {
    if (isAdminFieldVisible === false) {
      console.log("isAdminFieldVisible: Admin checkbox is checked!");
      setIsAdminFieldVisible(true);
    } else {
      setIsAdminFieldVisible(false);
      console.log("isAdminFieldVisible: Admin checkbox is unchecked!");
    }
  };

  const registerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "emailAddress") {
      props.setEmailAddress(event.target.value);
    } else if (event.target.id === "passwordhash") {
      setPasswordhash(event.target.value);
    } else if (event.target.id === "confirmPassword") {
      setConfirmPassword(event.target.value);
    } else if (event.target.id === "username") {
      props.setUsername(event.target.value);
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
    console.log("ValidateAllFieldsFunction Result: ", validateAllFields());
    if (validateAllFields()[0] === true) {
      await fetch(`${dbCall}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //TODO If user types in password correctly matching the column "adminPassword", isAdmin will be set to true.
        body: JSON.stringify({
          user: {
            username: props.username,
            email: props.emailAddress,
            passwordhash: passwordhash,
            isAdmin: AdminPasswordValidation(),
            accountResetQuestion1: accountResetQuestion1,
            accountResetQuestion2: accountResetQuestion2,
            accountResetAnswer1: accountResetAnswer1,
            accountResetAnswer2: accountResetAnswer2,
          },
        }),
      })
        .then((res) => {
          console.log("Reg res.status is ", res.status);
          props.setResponseStatus(res.status);
          return res.json();
        })
        //if response status is 201 and userAdmin is false or null, set isAdmin to false.
        .then((data) => {
          if (data.status === 201 && (data.user.isAdmin === false || data.user.isAdmin === null)) {
            console.log("Successfully registered!");
            console.log("Register data: ", data);
            props.setId(data.user.id);
            props.updateToken(data.sessionToken);
            props.setEmailAddress(data.user.email);
            props.setUsername(data.user.username);
            props.setIsAdmin(false);
            props.setIsUserLoggedIn(true);
            props.setErrorMessage("");
            navigate("/");
          } else if (data.status === 201 && data.user.isAdmin === true) {
            console.log("Admin | Successfully registered!");
            console.log("Admin | Register data: ", data);
            props.setId(data.user.id);
            props.updateToken(data.sessionToken);
            props.setEmailAddress(data.user.email);
            props.setUsername(data.user.username);
            props.setIsAdmin(true);
            props.setIsUserLoggedIn(true);
            props.setErrorMessage("");
            navigate("/AdminDashboard");
          } else {
            console.log("Error registering user!");
            console.log("Register data: ", data);
            console.log("isAdmin", data.user.isAdmin);
            props.setErrorMessage(data.message);
          }
        })
        .catch((error) => {
          console.log("Error registering user!");
          console.log("Register data error message: ", error);
          props.setErrorMessage(error.message);
        });
    } else {
      props.setErrorMessage("Please fix the errors in the form!");
    }
  };

  return (
		<div className="z-index-10 flex pb-4 h-5/6">
			<div
				className="h-screen flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20
    xl:px-24 overflow-y-auto"
			>
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
									placeholder="charles@barkley.com"
									value={props.emailAddress}
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
							<div
								className="mt-1"
								data-tooltip-target="username-tooltip"
								data-tooltip-placement="bottom"
							>
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									value={props.username}
									onChange={registerChange}
									required
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
								<div
									id="username-tooltip"
									role="tooltip"
									className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
								>
									Test<div className="tooltip-arrow" data-popper-arrow></div>
								</div>
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
									autoComplete="new-password"
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
									autoComplete="new-password"
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
											onChange={registerChange}
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
