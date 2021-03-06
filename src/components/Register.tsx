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
	const [accountResetQuestion1, setAccountResetQuestion1] =
		React.useState<string>("");
	const [accountResetQuestion2, setAccountResetQuestion2] =
		React.useState<string>("");
	const [accountResetAnswer1, setAccountAnswer1] = React.useState<string>("");
	const [accountResetAnswer2, setAccountAnswer2] = React.useState<string>("");
	const [adminPassword, setAdminPassword] = React.useState<string>("");
	const [isAdminFieldVisible, setIsAdminFieldVisible] =
		React.useState<boolean>(false);
	const [isRegistrationValid, setIsRegistrationValid] =
		React.useState<boolean>(true);
	const [isEmailValid, setIsEmailValid] = React.useState<boolean>(true);
	const [isPasswordValid, setIsPasswordValid] = React.useState<boolean>(true);
	const [isUsernameValid, setIsUsernameValid] = React.useState<boolean>(true);
	const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
		React.useState<boolean>(true);
	const [isAccountResetQuestion1Valid, setIsAccountResetQuestion1Valid] =
		React.useState<boolean>(true);
	const [isAccountResetQuestion2Valid, setIsAccountResetQuestion2Valid] =
		React.useState<boolean>(true);
	const [isAccountResetAnswer1Valid, setIsAccountResetAnswer1Valid] =
		React.useState<boolean>(true);
	const [isAccountResetAnswer2Valid, setIsAccountResetAnswer2Valid] =
		React.useState<boolean>(true);
	const [isAdminPasswordValid, setIsAdminPasswordValid] =
		React.useState<boolean>(true);
	const [invalidRegistrationMessage, setInvalidRegistrationMessage] =
		React.useState<string>("");
	const [invalidEmailAddressMessage, setInvalidEmailAddressMessage] =
		React.useState<string>("");
	const [invalidPasswordMessage, setInvalidPasswordMessage] =
		React.useState<string>("");
	const [invalidConfirmPasswordMessage, setInvalidConfirmPasswordMessage] =
		React.useState<string>("");
	const [
		invalidAccountResetQuestion1Message,
		setInvalidAccountResetQuestion1Message,
	] = React.useState<string>("");
	const [
		invalidAccountResetQuestion2Message,
		setInvalidAccountResetQuestion2Message,
	] = React.useState<string>("");
	const [
		invalidAccountResetAnswer1Message,
		setInvalidAccountResetAnswer1Message,
	] = React.useState<string>("");
	const [
		invalidAccountResetAnswer2Message,
		setInvalidAccountResetAnswer2Message,
	] = React.useState<string>("");
	const [invalidUsernameMessage, setInvalidUsernameMessage] =
		React.useState<string>("");
	const [invalidAdminPasswordMessage, setInvalidAdminPasswordMessage] =
		React.useState<string>("");

	//! Validation Fields

	//? Email Address
	const emailAddressValidation = () => {
		if (
			props.emailAddress.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
		) {
			console.log("Email Address is invalid");
			setIsEmailValid(false);
			setInvalidEmailAddressMessage("Email Address is invalid");
			return ["Invalid email address!", false];
		}
		return true;
	};

	//? Username
	const usernameValidation = () => {
		console.log("Username()");
		if (props.username.length < 3) {
			console.log("Username must be at least 3 characters!");
			setIsUsernameValid(false);
			setInvalidUsernameMessage("Username must be at least 3 characters!");
			return ["Username must be at least 3 characters!", false];
		}
		return true;
	};

	//? Password
	const passwordValidation = () => {
		if (passwordhash.length < 5) {
			console.log("Password must be at least 5 characters!");
			setIsPasswordValid(false);
			setInvalidPasswordMessage("Password must be at least 5 characters!");
			return ["Password must be at least 5 characters!", false];
		}
		return true;
	};

	//? Password Confirmation
	const passwordConfirmationValidation = () => {
		if (passwordhash !== confirmPassword) {
			console.log("Passwords do not match!");
			setIsConfirmPasswordValid(false);
			setInvalidConfirmPasswordMessage("Passwords do not match!");
			return ["Passwords do not match!", false];
		}
		return true;
	};

	//? Account Reset Question 1
	const accountResetQuestion1Validation = () => {
		// if the field contains at least 3 characters and a question mark to end it, it's valid. otherwise, tell the user it's invalid.
		if (
			accountResetQuestion1.length < 3 ||
			accountResetQuestion1.charAt(accountResetQuestion1.length - 1) !== "?"
		) {
			console.log(
				"Account Reset Question 1 must be at least 3 characters and end with a question mark!"
			);
			setIsAccountResetQuestion1Valid(false);
			setInvalidAccountResetQuestion1Message(
				"Account Reset Question 1 must be at least 3 characters and end with a question mark!"
			);
			return false;
		}
		return true;
	};

	//? Account Reset Question 2
	const accountResetQuestion2Validation = () => {
		// if the field contains at least 3 characters and a question mark to end it, it's valid. otherwise, tell the user it's invalid.
		if (
			accountResetQuestion2.length < 3 ||
			accountResetQuestion2.charAt(accountResetQuestion2.length - 1) !== "?"
		) {
			console.log(
				"Account Reset Question 2 must be at least 3 characters and end with a question mark!"
			);
			setIsAccountResetQuestion2Valid(false);
			setInvalidAccountResetQuestion2Message(
				"Account Reset Question 2 must be at least 3 characters and end with a question mark!"
			);
			return false;
		}
		return true;
	};

	//? Account Reset Answer 1
	const accountResetAnswer1Validation = () => {
		// as long as it isn't empty, it's valid. otherwise, tell the user it's invalid.
		if (accountResetAnswer1.length === 0) {
			console.log("Account Reset Answer 1 must not be empty!");
			setIsAccountResetAnswer1Valid(false);
			setInvalidAccountResetAnswer1Message(
				"Account Reset Answer 1 must not be empty!"
			);
			return false;
		}
		return true;
	};

	//? Account Reset Answer 2
	const accountResetAnswer2Validation = () => {
		// as long as it isn't empty, it's valid. otherwise, tell the user it's invalid.
		if (accountResetAnswer2.length === 0) {
			console.log("Account Reset Answer 2 must not be empty!");
			setIsAccountResetAnswer2Valid(false);
			setInvalidAccountResetAnswer2Message(
				"Account Reset Answer 2 must not be empty!"
			);
			return false;
		}
		return true;
	};

	//? Admin Password (if admin)
	//* If they leave the adminPassword field blank, set isAdmin to false.
	//* If they type in the password from process.env.ADMIN_PW_VALUE incorrectly, set isAdmin to false, display error message, set errorMessage to "Incorrect admin password. Please leave this field blank if you wish to register as a standard user or try again.", and keep the user on the page.
	//* If they type in the password from process.env.ADMIN_PW_VALUE correctly, set isAdmin to true.

	const AdminPasswordValidation = () => {
		if (adminPassword.length === 0) {
			console.log(
				"Admin password field is empty! Registering as standard user."
			);
			props.setIsAdmin(false);
			return null;
		} else if (adminPassword !== process.env.REACT_APP_ADMIN_PW_VALUE) {
			console.log("Incorrect admin password! Try again/blank it out.");

			props.setIsAdmin(null);
			props.setErrorMessage(
				"Incorrect admin password. Please try again or leave this field blank if you wish to register as a standard user."
			);
			setIsAdminPasswordValid(false);
			setInvalidAdminPasswordMessage(
				"Incorrect admin password. Try again or leave this field blank if you wish to register as a standard user."
			);
			return false;
		} else if (adminPassword === process.env.REACT_APP_ADMIN_PW_VALUE) {
			console.log("Correct admin password!");
			props.setIsAdmin(true);
			return true;
		}
	};

	//? Validate all fields
	const validateAllFields = () => {
		usernameValidation();
		passwordValidation();
		passwordConfirmationValidation();
		accountResetQuestion1Validation();
		accountResetQuestion2Validation();
		accountResetAnswer1Validation();
		accountResetAnswer2Validation();
		AdminPasswordValidation();
		if (
			usernameValidation() === true &&
			emailAddressValidation() === true &&
			passwordValidation() === true &&
			passwordConfirmationValidation() === true &&
			accountResetQuestion1Validation() === true &&
			accountResetQuestion2Validation() === true &&
			accountResetAnswer1Validation() === true &&
			accountResetAnswer2Validation() === true &&
			AdminPasswordValidation() === true
		) {
			return [
				true,
				"Admin user succesfully registered!",
				"You are now logged in as an admin!",
			];
		} else if (
			emailAddressValidation() === true &&
			passwordValidation() === true &&
			passwordConfirmationValidation() === true &&
			usernameValidation() === true &&
			accountResetQuestion1Validation() === true &&
			accountResetQuestion2Validation() === true &&
			accountResetAnswer1Validation() === true &&
			accountResetAnswer2Validation() === true &&
			AdminPasswordValidation() === null
		) {
			return [true, "Standard user succesfully registered!"];
		} else {
			setIsRegistrationValid(false);
			setInvalidRegistrationMessage(
				"Please fix the errors in the form and try again."
			);
			return [false, "Registration failed. Please validate all the fields."];
		}
	};

	//! END of Validation Fields

	//! Handling Changes
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

	//! END of Handling Changes

	//! Handling Submits

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
					if (
						data.status === 201 &&
						(data.user.isAdmin === false || data.user.isAdmin === null)
					) {
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

	//! END of Handling Submits

	//! Render / Return

	//TODO Add a "Forgot Password" button.
	//TODO Add conditionals for when the tooltips are triggered when a user fails to meet registration requirements | add dismissable alerts for error message on form.
	//TODO Possibly change tooltips to Helper text.
	//TODO Implement fields with icons. https://flowbite.com/docs/components/forms/
	//TODO Change the isAdmin button to a toogle switch => modal open instead. Checkboxes are scary to users. Wait, maybe I keep checkboxes then...

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
					{/* Email Address */}
					<form className="space-y-6" onSubmit={registerSubmit}>
						<div>
							<label
								htmlFor="emailAddress"
								className="block text-sm font-medium leading-5 text-gray-700"
							>
								Email Address
							</label>
							<div className="mt-1">
								{isEmailValid ? (
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
								) : (
									<input
										id="emailAddress"
										name="emailAddress"
										type="text"
										placeholder={invalidEmailAddressMessage}
										value={props.emailAddress}
										onChange={registerChange}
										required
										className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
									/>
								)}
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
								{isUsernameValid ? (
									<>
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
											Username must be at least 3 characters.
											<div className="tooltip-arrow" data-popper-arrow></div>
										</div>
									</>
								) : (
									<div>
										<input
											id="username"
											name="username"
											type="text"
											autoComplete="username"
											value={props.username}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
										/>
										<p className="text-red-500 text-xs italic">
											{invalidUsernameMessage}
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-1">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div
								className="mt-1"
								data-tooltip-target="password-tooltip"
								data-tooltip-placement="bottom"
							>
								{isPasswordValid ? (
									<div>
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
										<div
											id="password-tooltip"
											role="tooltip"
											className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
										>
											Password must contain at least 5 characters.
											<div className="tooltip-arrow" data-popper-arrow></div>
										</div>
									</div>
								) : (
									<div>
										<input
											id="passwordhash"
											name="passwordhash"
											type="password"
											autoComplete="new-password"
											value={passwordhash}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
										/>
										<p className="text-red-500 text-xs italic">
											{invalidPasswordMessage}
										</p>
									</div>
								)}
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
								{isConfirmPasswordValid ? (
									<div>
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
								) : (
									<div>
										<input
											id="confirmPassword"
											name="confirmPassword"
											type="password"
											autoComplete="new-password"
											value={confirmPassword}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
										/>
										<p className="text-red-500 text-xs italic">
											{invalidConfirmPasswordMessage}
										</p>
									</div>
								)}
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
							<div
								className="mt-1"
								data-tooltip-target="ARq1-tooltip"
								data-tooltip-placement="bottom"
							>
								{isAccountResetQuestion1Valid ? (
									<div>
										<input
											id="accountResetQuestion1"
											name="accountResetQuestion1"
											type="text"
											value={accountResetQuestion1}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										<div
											id="ARq1-tooltip"
											role="tooltip"
											className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
										>
											ex: What's your favorite color?
											<div className="tooltip-arrow" data-popper-arrow></div>
										</div>
									</div>
								) : (
									<div>
										<input
											id="accountResetQuestion1"
											name="accountResetQuestion1"
											type="text"
											value={accountResetQuestion1}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
										/>
										<p className="text-red-500 text-xs italic">
											{invalidAccountResetQuestion1Message}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Account Reset Answer 1 */}
						<div
							className="space-y-1"
							data-tooltip-target="ARa1-tooltip"
							data-tooltip-placement="bottom"
						>
							<label
								htmlFor="accountResetAnswer1"
								className="block text-sm font-medium text-gray-700"
							>
								Account Reset Answer 1
							</label>
							<div className="mt-1">
								{isAccountResetAnswer1Valid ? (
									<div>
										<input
											id="accountResetAnswer1"
											name="accountResetAnswer1"
											type="text"
											value={accountResetAnswer1}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										<div
											id="ARa1-tooltip"
											role="tooltip"
											className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
										>
											The answer to Account Reset Question 1.
											<div className="tooltip-arrow" data-popper-arrow></div>
										</div>
									</div>
								) : (
									<div>
										<input
											id="accountResetAnswer1"
											name="accountResetAnswer1"
											type="text"
											value={accountResetAnswer1}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
										/>
										<p className="text-red-500 text-xs italic">
											{invalidAccountResetAnswer1Message}
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Account Reset Question 1 */}

						<label
							htmlFor="accountResetQuestion2"
							className="block text-sm font-medium text-gray-700"
						>
							Account Reset Question 2
						</label>
						<div className="mt-1">
							{isAccountResetQuestion2Valid ? (
								<div
									className="space-y-1"
									data-tooltip-target="ARq2-tooltip"
									data-tooltip-placement="bottom"
								>
									<div>
										<input
											id="accountResetQuestion2"
											name="accountResetQuestion2"
											type="text"
											value={accountResetQuestion2}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										<div
											id="ARq2-tooltip"
											role="tooltip"
											className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
										>
											ex: What's your first car?
											<div className="tooltip-arrow" data-popper-arrow></div>
										</div>
									</div>
								</div>
							) : (
								<div>
									<input
										id="accountResetQuestion2"
										name="accountResetQuestion2"
										type="text"
										value={accountResetQuestion2}
										onChange={registerChange}
										required
										className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
									/>
									<p className="text-red-500 text-xs italic">
										{invalidAccountResetQuestion2Message}
									</p>
								</div>
							)}
						</div>

						{/* Account Reset Answer 2 */}
						<div
							className="space-y-1"
							data-tooltip-target="ARa2-tooltip"
							data-tooltip-placement="bottom"
						>
							<label
								htmlFor="accountResetAnswer2"
								className="block text-sm font-medium text-gray-700"
							>
								Account Reset Answer 2
							</label>
							<div className="mt-1">
								{isAccountResetAnswer2Valid ? (
									<div>
										<input
											id="accountResetAnswer2"
											name="accountResetAnswer2"
											type="text"
											value={accountResetAnswer2}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										<div
											id="ARa2-tooltip"
											role="tooltip"
											className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
										>
											The answer to Account Reset Question 2.
											<div className="tooltip-arrow" data-popper-arrow></div>
										</div>
									</div>
								) : (
									<div>
										<input
											id="accountResetAnswer2"
											name="accountResetAnswer2"
											type="text"
											value={accountResetAnswer2}
											onChange={registerChange}
											required
											className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
										/>
										<p>{invalidAccountResetAnswer2Message}</p>
									</div>
								)}
							</div>
						</div>

						{/* Admin Radio Button. If turned on, set isAdminFieldVisible to true with isAdminFieldVisibleTrue function, and show admin password field. */}
						<div
							className="space-y-1"
							data-tooltip-target="admin-tooltip"
							data-tooltip-placement="top"
						>
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
								<div
									id="admin-tooltip"
									role="tooltip"
									className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
								>
									Leave this field blank if you are not an admin.
									<div className="tooltip-no-arrow" data-popper-arrow></div>
								</div>
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
										{isAdminPasswordValid ? (
											<div>
												<input
													id="adminPassword"
													name="adminPassword"
													type="password"
													onChange={registerChange}
													value={adminPassword}
													className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												/>
											</div>
										) : (
											<div>
												<input
													id="adminPassword"
													name="adminPassword"
													type="password"
													onChange={registerChange}
													value={adminPassword}
													className="appearance-none block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
												/>
												<p className="text-red-500 text-xs italic">
													{invalidAdminPasswordMessage}
												</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
						<div>
							{isRegistrationValid ? (
								<div>
									<button
										type="submit"
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Register
									</button>
								</div>
							) : (
								<div>
									<p className="text-center text-red-500 text-md italic border-y border-y-indigo-300 hover:border-indigo-900 mb-1">
										{invalidRegistrationMessage}
									</p>
									<button
										type="submit"
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Register
									</button>
								</div>
							)}
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
