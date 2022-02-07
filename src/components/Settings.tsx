import React from 'react';
import { ABCtoken, ABCuserInfo, ABCcalls } from "../App";
import dbCall from "../helpers/Environments";
import {useNavigate, Link} from 'react-router-dom';

interface SettingsProps {
    id: ABCuserInfo["id"];
    emailAddress: ABCuserInfo["emailAddress"];
    setEmailAddress: ABCuserInfo["setEmailAddress"];
    sessionToken: ABCtoken["sessionToken"];
    username: ABCuserInfo["username"];
    setUsername: ABCuserInfo["setUsername"];
    responseStatus: ABCcalls["responseStatus"];
    setResponseStatus: ABCcalls["setResponseStatus"];
}

interface SettingsState {
    errorMessage: string;
    emailAddress: string;
    username: string;
    responseStatus: number;
    accountResetQuestion1: string;
    accountResetQuestion2: string;
    accountResetAnswer1: string;
    accountResetAnswer2: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
    showResetOptions: boolean;
}

//! On this page, after the user has logged in, they can change their username, email address, and password.
    //? The user is only able to edit their username, email address and password if they have a session token, which is stored in localStorage, enter their password, and answer accountResetAnswer1 and accountResetAnswer2 correctly. 

    //? AFter doing so, it will toggle a UI element where they can update their username, email address, and password. After hitting save, it will notify the user that the changes have been saved.If the user does not have a session token, they will be redirected to the login page.
export default class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor(props: SettingsProps) {
		super(props);
		this.state = {
			errorMessage: "",
			responseStatus: 500,
			emailAddress: "",
			username: "",
			accountResetQuestion1: "",
			accountResetQuestion2: "",
			accountResetAnswer1: "",
			accountResetAnswer2: "",
			password: "",
			newPassword: "",
            confirmNewPassword: "",
            showResetOptions: false
		};
		this.handleSubmitUpdatePassword = this.handleSubmitUpdatePassword.bind(this);
		this.handleSubmitUpdateUsername = this.handleSubmitUpdateUsername.bind(this);
		this.handleSubmitUpdateEmailAddress =this.handleSubmitUpdateEmailAddress.bind(this);
		this.handleChange = this.handleChange.bind(this);
		// this.accountResetQuestion1 = this.accountResetQuestion1.bind(this);
		// this.accountResetQuestion2 = this.accountResetQuestion2.bind(this);
		this.accountResetAnswer1 = this.accountResetAnswer1.bind(this);
		this.accountResetAnswer2 = this.accountResetAnswer2.bind(this);
		this.didUserAnswerAccountResetAnswersCorrectlySubmit =this.didUserAnswerAccountResetAnswersCorrectlySubmit.bind(this);
	}

	//! grabUsersAccountResetQuestions() grabs the users account reset questions from the database.
	//? The database fetch GET request is made to the `${dbCall}/users/settings/:id` route.
	//? It is asynchronously called.
	//? The response is then parsed as JSON.

	grabUsersAccountResetQuestions = (): void => {
		fetch(`${dbCall}/users/settings/${this.props.id}`, {
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.props.sessionToken}`,
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				this.setState({
					accountResetQuestion1: response.accountResetQuestion1,
					accountResetQuestion2: response.accountResetQuestion2,
				});
			})
			.catch((error) => {
				this.setState({
					errorMessage: error.message,
					responseStatus: error.response.status,
				});
			});
	};

	//! grabUserAccountResetQuestions is loaded immediately after the component mounts.
	componentDidMount() {
		this.grabUsersAccountResetQuestions();
		console.log("SessionToken: :", this.props.sessionToken);
	}

	accountResetAnswer1(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			accountResetAnswer1: event.target.value,
		});
	}

	accountResetAnswer2(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			accountResetAnswer2: event.target.value,
		});
	}
	//! didUserAnswerAccountResetQuestions() checks if the user has answered the account reset questions (accountResetAnswer1 and accountResetAnswer2) from `${dbCall}/users/settings/resetAnswers/:id`. If they have, it will return true. If they have not, it will return false. This will be used in a form to check if the user has answered the account reset questions correctly.
	didUserAnswerAccountResetAnswersCorrectlySubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
        await fetch(`${dbCall}/users/settings/resetAnswers/${this.props.id}`, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.sessionToken}`,
            }),
            body: JSON.stringify({
                user: {
                    accountResetAnswer1: this.state.accountResetAnswer1,
                    accountResetAnswer2: this.state.accountResetAnswer2,
                }
            })
        })
			.then((res) => {
				console.log("Answer Confirmation Resolution: ", res);
				return res.json();
			})
			.then((data) => {
				if (
					data.status === 200 &&
					data.message === "Users answers are correct!" &&
					data.boolean === true
				) {
					this.setState({
						responseStatus: data.status,
                        errorMessage: data.message,
                        showResetOptions: true
                    });
                    console.log("Answer Confirmation Data: ", data);
					return true;
				} else {
					this.setState({
						responseStatus: data.status,
                        errorMessage: data.message,
                        showResetOptions: false
                    });
                    console.log("ELSE Answer Error Data :", data);
					return false;
				}
			})
			.catch((error) => {
				console.log("Answer Confirmation Error: ", error);
				this.setState({
					responseStatus: error.status,
                    errorMessage: error.message,
                    showResetOptions: false
				});
				return false;
			});
	};

	//! CHANGE section.

	//! handleChange() is called when the user changes the value of a form input.
	handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value,
		});
	};

	//! SUBMIT section.

	//! handleSubmitUpdatePassword() is called when the user clicks the update password button.

	handleSubmitUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (this.state.newPassword === "" || this.state.confirmNewPassword === "") {
			this.setState({
				errorMessage: "Please fill out all fields.",
			});
		} else if (this.state.newPassword !== this.state.confirmNewPassword) {
			this.setState({
				errorMessage: "New passwords do not match.",
			});
		} else {
			await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
			if (
				this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === ""
			) {
				this.setState({
					errorMessage: "Please answer the account reset questions.",
				});
			} else {
				await fetch(`${dbCall}/users/settings/password/${this.props.id}`, {
					method: "PUT",
					headers: new Headers({
						"Content-Type": "application/json",
					}),
					body: JSON.stringify({
						user: {
							passwordhash: this.state.password,
						},
					}),
				})
					.then((res) => {
						console.log("Password update status is: " + res.status);
						this.props.setResponseStatus(res.status);
						return res.json();
					})
					.then((data) => {
						if (data.status === 200 && data.message === "Username updated!") {
							console.log("Password reset data: " + data);
							this.setState({
								errorMessage: data.message,
								responseStatus: data.status,
							});
						} else {
							console.log("ELSE Password reset data: " + data);
							this.setState({
								errorMessage: data.message,
								responseStatus: data.status,
							});
						}
					})
					.catch((error) => {
						console.log("Password update error: " + error.message);
						this.setState({
							errorMessage: error.message,
							responseStatus: error.response.status,
						});
					});
			}
		}
	};

	//! handleSubmitUpdateUsername() is called when the user clicks the update username button.
	//? Once server sends a status 200 & message "Username udpated!", then 'setUsername: ABCuserInfo["setUsername"];' is called.
	handleSubmitUpdateUsername = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			this.state.accountResetAnswer1 === "" ||
			this.state.accountResetAnswer2 === ""
		) {
			this.setState({
				errorMessage: "Please answer the account reset questions.",
			});
		} else {
			await fetch(`${dbCall}/users/settings/username/${this.props.id}`, {
				method: "PUT",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
				body: JSON.stringify({
					user: {
						username: this.state.username,
					},
				}),
			})
				.then((res) => {
					console.log("Username update status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (data.status === 200 && data.message === "Username updated!") {
						console.log("Username reset data: " + data);
						this.props.setUsername(data.user.username);
						this.setState({
							errorMessage: data.message,
							responseStatus: data.status,
						});
					}
				})
				.catch((error) => {
					console.log("Username update error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.response.status,
					});
				});
		}
	};

	//! handleSubmitUpdateEmailAddress() is called when the user clicks the update email address button.
	//? Once server sends a status 200 & message "Email updated" then 'setEmailAddress: ABCuserInfo["setEmailAddress"]' is called.
	handleSubmitUpdateEmailAddress = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			this.state.accountResetAnswer1 === "" ||
			this.state.accountResetAnswer2 === ""
		) {
			this.setState({
				errorMessage: "Please answer the account reset questions.",
			});
		} else {
			await fetch(`${dbCall}/users/settings/email/${this.props.id}`, {
				method: "PUT",
				headers: new Headers({
					"Content-Type": "application/json",
				}),
				body: JSON.stringify({
					user: {
						email: this.state.emailAddress,
					},
				}),
			})
				.then((res) => {
					console.log("Email Address update status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (data.status === 200 && data.message === "Email updated!") {
						console.log("Email Address reset data: " + data);
						this.props.setEmailAddress(this.state.emailAddress);
						this.setState({
							errorMessage: data.message,
							responseStatus: data.status,
						});
					} else {
						console.log("ELSE Email Address reset data: " + data);
						this.setState({
							errorMessage: data.message,
							responseStatus: data.status,
						});
					}
				})
				.catch((error) => {
					console.log("Email Address update error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.response.status,
					});
				});
		}
	};

	//!How the return will render the page.
	//? 1) The page will mount and the User's questions (AccountResetQuestion 1 and AccountResetQuestion2) will be displayed.
	//? 2) They then will have an input field to enter their answer to the questions (AccountResetAnswer1 and AccountResetAnswer2).
	//? 3) If in step 2, didUserAnswerAccountResetAnswersCorrectly() returns true, 3 separate fields will be displayed each with their own submit button. They will be for handleSubmitUpdatePassword(), handleSubmitUpdateUsername(), and handleSubmitUpdateEmailAddress().
	//? 4) If in step 2, didUserAnswerAccountResetAnswersCorrectly() returns false, then an error message will be displayed and the 3 seperate fields will not be displayed.
	//? 5) If in step 3, the user clicks the submit button for the update password, then handleSubmitUpdatePassword() will be called.
	//? 6) If in step 3, the user clicks the submit button for the update username, then handleSubmitUpdateUsername() will be called.
	//? 7) If in step 3, the user clicks the submit button for the update email address, then handleSubmitUpdateEmailAddress() will be called.

    render() {
        return (
            <div className="account-reset-container">
                <div className="account-reset-question-container">
                    <div className="account-reset-question-1">
                        <p>{this.state.accountResetQuestion1}</p>
                    </div>
                    <div className="account-reset-question-2">
                        <p>{this.state.accountResetQuestion2}</p>
                    </div>
                </div>
                <form
                    onSubmit={this.didUserAnswerAccountResetAnswersCorrectlySubmit}
                    className="account-reset-answer-container"
                >
                    <div className="account-reset-answer-1">
                        <input
                            placeholder="Answer to Question 1"
                            type="text"
                            name="accountResetAnswer1"
                            value={this.state.accountResetAnswer1}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="account-reset-answer-2">
                        <input
                            placeholder="Answer to Question 2"
                            type="text"
                            name="accountResetAnswer2"
                            value={this.state.accountResetAnswer2}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="account-reset-submit-container">
                        <button type="submit" className="account-reset-submit-button">
                            Submit
                        </button>
                    </div>
                </form>
                {/* State showResetOptions is set to true when the user correctly answers the account reset questions. */}
                {/* If it returns true, a drop down displays giving the user to update their username, password, and email address each in their own individual form field. */}
                {/* If it returns false, nothing will show to the user. */}
                {this.state.showResetOptions ? (
                    <div className="account-reset-update-container">
                        <div className="account-reset-update-password-container">
                            <form
                                onSubmit={this.handleSubmitUpdatePassword}
                                className="account-reset-update-password-form"
                            >
                                <div className="account-reset-update-password-input-container">
                                    <input
                                        placeholder="New Password"
                                        type="password"
                                        name="accountResetUpdatePassword"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="account-reset-update-password-submit-container">
                                    <button
                                        type="submit"
                                        className="account-reset-update-password-submit-button"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="account-reset-update-username-container">
                            <form
                                onSubmit={this.handleSubmitUpdateUsername}
                                className="account-reset-update-username-form"
                            >
                                <div className="account-reset-update-username-input-container">
                                    <input
                                        placeholder={this.props.username}
                                        type="text"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="account-reset-update-username-submit-container">
                                    <button
                                        type="submit"
                                        className="account-reset-update-username-submit-button"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="account-reset-update-email-address-container">
                            <form
                                onSubmit={this.handleSubmitUpdateEmailAddress}
                                className="account-reset-update-email-address-form"
                            >
                                <div className="account-reset-update-email-address-input-container">
                                    <input
                                        placeholder={this.props.emailAddress}
                                        type="text"
                                        name="emailAddress"
                                        value={this.state.emailAddress}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="account-reset-update-email-address-submit-container">
                                    <button
                                        type="submit"
                                        className="account-reset-update-email-address-submit-button"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

