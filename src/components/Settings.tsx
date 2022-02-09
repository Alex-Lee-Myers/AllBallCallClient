import React from "react";
import { ABCtoken, ABCuserInfo, ABCcalls } from "../App";
import dbCall from "../helpers/Environments";
import { useNavigate, Link } from "react-router-dom";

interface SettingsProps {
	id: ABCuserInfo["id"];
	emailAddress: ABCuserInfo["emailAddress"];
	setEmailAddress: ABCuserInfo["setEmailAddress"];
	sessionToken: ABCtoken["sessionToken"];
	username: ABCuserInfo["username"];
	setUsername: ABCuserInfo["setUsername"];
	responseStatus: ABCcalls["responseStatus"];
	setResponseStatus: ABCcalls["setResponseStatus"];
	clearToken: ABCtoken["clearToken"];
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

	//? Delete Options.
	deleteContentOptions: boolean; //* This drops down an accordion of options for the user to delete the user, video, and content.
	//! Delete the user.
	showDeleteUserModal: boolean; //* User has clicked on modal to open prompting to delete user account.
	deleteUserPassword: string; //* Password: "IHATEBASKETBALL" inputted
	userIsDeleted: boolean; //* If the password is correct for "deleteUserPassword", and they click the "Delete My Account" button, set to true.
	//! Delete all of user's comments.
	showDeleteUserCommentsModal: boolean; //* User has clicked on modal to open prompting them to delete all of their comments.
	deleteUserCommentsPassword: string; //* Password: "CANTJUMP" inputted
	userCommentsIsDeleted: boolean; //* If the password is correct for "deleteUserCommentsPassword", and they click the "Delete All My Comments" button, set to true.
	//! Delete all of user's videos
	showDeleteUserVideosModal: boolean; //* User has clicked on modal to open prompting them to delete all of their videos.
	deleteUserVideosPassword: string; //* Password: "HOOSIER"
	userVideosIsDeleted: boolean; //* If the password is correct for "deleteUserVideosPassword", and they click the "Delete All of My Videos" button, set to true.
}

// TODO Deleting comments button and deleting videos button takes user to a page to individually delete their comments or videos.
export default class Settings extends React.Component<
	SettingsProps,
	SettingsState
> {
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
			showResetOptions: false,

			//? Delete Options.
			deleteContentOptions: false,
			//! Delete the User
			showDeleteUserModal: false,
			deleteUserPassword: "",
			userIsDeleted: false,
			//! Delete the Comments
			showDeleteUserCommentsModal: false,
			deleteUserCommentsPassword: "",
			userCommentsIsDeleted: false,
			//! Delete the Videos,
			showDeleteUserVideosModal: false,
			deleteUserVideosPassword: "",
			userVideosIsDeleted: false,
		};
		this.handleSubmitUpdatePassword =
			this.handleSubmitUpdatePassword.bind(this);
		this.handleSubmitUpdateUsername =
			this.handleSubmitUpdateUsername.bind(this);
		this.handleSubmitUpdateEmailAddress =
			this.handleSubmitUpdateEmailAddress.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.accountResetAnswer1 = this.accountResetAnswer1.bind(this);
		this.accountResetAnswer2 = this.accountResetAnswer2.bind(this);
		this.didUserAnswerAccountResetAnswersCorrectlySubmit =
			this.didUserAnswerAccountResetAnswersCorrectlySubmit.bind(this);
		this.newPasswordInput = this.newPasswordInput.bind(this);
		this.confirmNewPasswordInput = this.confirmNewPasswordInput.bind(this);
		this.passwordInput = this.passwordInput.bind(this);
		this.deleteUserSubmit = this.deleteUserSubmit.bind(this);
		this.deleteUserCommentsSubmit = this.deleteUserCommentsSubmit.bind(this);
		this.deleteUserVideosSubmit = this.deleteUserVideosSubmit.bind(this);
		this.deleteUserConfirmation = this.deleteUserConfirmation.bind(this);
		this.deleteUserCommentsConfirmation =
			this.deleteUserCommentsConfirmation.bind(this);
		this.deleteUserVideosConfirmation =
			this.deleteUserVideosConfirmation.bind(this);
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

	//! didUserAnswerAccountResetQuestions() checks if the user has answered the account reset questions (accountResetAnswer1 and accountResetAnswer2) from `${dbCall}/users/settings/resetAnswers/:id`. If they have, it will return true. If they have not, it will return false. This will be used in a form to check if the user has answered the account reset questions correctly.
	didUserAnswerAccountResetAnswersCorrectlySubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
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
				},
			}),
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
						showResetOptions: true,
						deleteContentOptions: true,
					});
					console.log("Answer Confirmation Data: ", data);
					return true;
				} else {
					this.setState({
						responseStatus: data.status,
						errorMessage: data.message,
						showResetOptions: false,
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
					showResetOptions: false,
				});
				return false;
			});
	};

	//! CHANGE section.

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

	newPasswordInput(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			newPassword: event.target.value,
		});
	}

	confirmNewPasswordInput(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			confirmNewPassword: event.target.value,
		});
	}

	passwordInput(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			password: event.target.value,
		});
	}

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
				await fetch(
					`${dbCall}/users/settings/passwordUpdate/${this.props.id}`,
					{
						method: "PUT",
						headers: new Headers({
							"Content-Type": "application/json",
							Authorization: `Bearer ${this.props.sessionToken}`,
						}),
						body: JSON.stringify({
							user: {
								passwordhash: this.state.newPassword,
							},
						}),
					}
				)
					.then((res) => {
						console.log("Password update status is: " + res.status);
						this.props.setResponseStatus(res.status);
						return res.json();
					})
					.then((data) => {
						if (data.status === 200 && data.message === "Password updated!") {
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
							responseStatus: error.status,
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
			await fetch(`${dbCall}/users/settings/usernameUpdate/${this.props.id}`, {
				method: "PUT",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
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
						responseStatus: error.status,
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
			await fetch(`${dbCall}/users/settings/emailUpdate/${this.props.id}`, {
				method: "PUT",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
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

	//! Delete Account + Videos + Comments
	//? 1) The page will mount and the User's questions (AccountResetQuestion 1 and AccountResetQuestion2) will be displayed.
	//? 2) They then will have an input field to enter their answer to the questions (AccountResetAnswer1 and AccountResetAnswer2).
	//? 3) If in step 2, didUserAnswerAccountResetAnswersCorrectly() returns true, delete account button will be displayed, delete videos button will be displayed, and delete comments button will be displayed.
	//? 4) If in step 2, didUserAnswerAccountResetAnswersCorrectly() returns false, then an error message will be displayed and the 3 seperate fields will not be displayed.
	//? 5) If in step 3, the user clicks the delete account button, then handleSubmitDeleteAccount() will be called.
	//* 5.1) The user will be prompted after hitting the delete account button to confirm that they want to delete their account by entering their password.
	//* 5.2) This will also delete the user's account from the database.
	//* 5.3) At the same time, the user will be logged out.
	//* 5.4) The user will be redirected to the home page with useNavigate()
	//* 5.5) This will delete the user's account and all of their videos and comments.
	//* 5.6) The user will be notified that their account has been deleted.
	//? 6) If in step 3, the user clicks the delete videos button, then handleSubmitDeleteVideos() will be called.
	//* 6.1) The user will be prompted after hitting the delete videos button to confirm that they want to delete their videos by entering their password.
	//* 6.2) This will also delete the user's videos from the database.
	//* 6.3) The user will be notified that their videos have been deleted.
	//? 7) If in step 3, the user clicks the delete comments button, then handleSubmitDeleteComments() will be called.
	//* 7.1) The user will be prompted after hitting the delete comments button to confirm that they want to delete their comments by entering their password.
	//* 7.2) This will also delete the user's comments from the database.
	//* 7.3) The user will be notified that their comments have been deleted.

	//! handleSubmitDeleteAccount() is called when the user clicks the delete account button.
	//?

	//!How the return will render the page.
	//? 1) The page will mount and the User's questions (AccountResetQuestion 1 and AccountResetQuestion2) will be displayed.
	//? 2) They then will have an input field to enter their answer to the questions (AccountResetAnswer1 and AccountResetAnswer2).
	//? 3) If in step 2, didUserAnswerAccountResetAnswersCorrectly() returns true, 3 separate fields will be displayed each with their own submit button. They will be for handleSubmitUpdatePassword(), handleSubmitUpdateUsername(), and handleSubmitUpdateEmailAddress().
	//? 4) If in step 2, didUserAnswerAccountResetAnswersCorrectly() returns false, then an error message will be displayed and the 3 seperate fields will not be displayed.
	//? 5) If in step 3, the user clicks the submit button for the update password, then handleSubmitUpdatePassword() will be called.
	//? 6) If in step 3, the user clicks the submit button for the update username, then handleSubmitUpdateUsername() will be called.
	//? 7) If in step 3, the user clicks the submit button for the update email address, then handleSubmitUpdateEmailAddress() will be called.

	deleteContentPasswordConfirmation = async (
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
			await fetch(
				`${dbCall}/users/settings/userDeleteContentPasswordConfirmation/${this.props.id}`,
				{
					method: "DELETE",
					headers: new Headers({
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.props.sessionToken}`,
					}),
				}
			)
				.then((res) => {
					console.log("Content deletion resolution status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message ===
							"Content approved to delete via Password confirmation!"
					) {
						this.props.clearToken();
						console.log("Content deletion password confirmation data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
						// deleteContentPasswordConfirmation: true,
					});
				})
				.catch((error) => {
					console.log(
						"Content deletion password confirmation error: " + error.message
					);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

	deleteUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
			await fetch(`${dbCall}/users/settings/deleteUser/${this.props.id}`, {
				method: "DELETE",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				}),
			})
				.then((res) => {
					console.log("Delete User status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message === "User successfully deleted!"
					) {
						this.props.clearToken();
						console.log("Delete User data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
					});
				})
				.catch((error) => {
					console.log("Delete User error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

	deleteUserConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			this.state.accountResetAnswer1 === "" ||
			this.state.accountResetAnswer2 === ""
		) {
			this.setState({
				errorMessage: "Please answer the account reset questions.",
			});
		} else {
			await fetch(
				`${dbCall}/users/settings/deleteUserConfirmation/${this.props.id}`,
				{
					method: "DELETE",
					headers: new Headers({
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.props.sessionToken}`,
					}),
				}
			)
				.then((res) => {
					console.log("Delete User Confirmation status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message === "User successfully deleted!"
					) {
						this.props.clearToken();
						console.log("Delete User Confirmation data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
						// deleteContentPasswordConfirmation: false,
					});
				})
				.catch((error) => {
					console.log("Delete User Confirmation error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

	deleteUserVideosSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
			await fetch(`${dbCall}/users/settings/deleteVideos/${this.props.id}`, {
				method: "DELETE",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				}),
			})
				.then((res) => {
					console.log("Delete Videos status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message === "Videos successfully deleted!"
					) {
						this.props.clearToken();
						console.log("Delete Videos data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
					});
				})
				.catch((error) => {
					console.log("Delete Videos error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

	deleteUserCommentsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
			await fetch(`${dbCall}/users/settings/deleteComments/${this.props.id}`, {
				method: "DELETE",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				}),
			})
				.then((res) => {
					console.log("Delete Comments status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message === "Comments successfully deleted!"
					) {
						this.props.clearToken();
						console.log("Delete Comments data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
					});
				})
				.catch((error) => {
					console.log("Delete Comments error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

	deleteUserVideosConfirmation = async (
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
			await fetch(`${dbCall}/users/settings/deleteVideos/${this.props.id}`, {
				method: "DELETE",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				}),
			})
				.then((res) => {
					console.log("Delete Videos status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message === "Videos successfully deleted!"
					) {
						this.props.clearToken();
						console.log("Delete Videos data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
					});
				})
				.catch((error) => {
					console.log("Delete Videos error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

	deleteUserCommentsConfirmation = async (
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
			await fetch(`${dbCall}/users/settings/deleteComments/${this.props.id}`, {
				method: "DELETE",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				}),
			})
				.then((res) => {
					console.log("Delete Comments status is: " + res.status);
					this.props.setResponseStatus(res.status);
					return res.json();
				})
				.then((data) => {
					if (
						data.status === 200 &&
						data.message === "Comments successfully deleted!"
					) {
						this.props.clearToken();
						console.log("Delete Comments data: " + data);
						this.props.setResponseStatus(data.status);
					}
					this.setState({
						errorMessage: data.message,
						responseStatus: data.status,
					});
				})
				.catch((error) => {
					console.log("Delete Comments error: " + error.message);
					this.setState({
						errorMessage: error.message,
						responseStatus: error.status,
					});
				});
		}
	};

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
								<div className="account-reset-update-newPassword-input-container">
									<input
										placeholder="New Password"
										type="password"
										name="accountResetUpdatePassword"
										value={this.state.newPassword}
										onChange={this.newPasswordInput}
									/>
								</div>

								<div className="account-reset-update-newPasswordConfirm-input-container">
									<input
										placeholder="Confirm New Password"
										type="password"
										name="accountResetUpdatePasswordConfirm"
										value={this.state.confirmNewPassword}
										onChange={this.confirmNewPasswordInput}
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
