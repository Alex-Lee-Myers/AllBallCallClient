import React from "react";
import { ABCtoken, ABCuserInfo, ABCcalls } from "../App";
import dbCall from "../helpers/Environments";
import { Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
	deleteUserAccountPassword: string; //* Password: "IHATEBASKETBALL" inputted
	userIsDeleted: boolean; //* If the password is correct for "deleteUserPassword", and they click the "Delete My Account" button, set to true.
	openDeleteUserModal: boolean; //* User has clicked on the "Delete My Account" button.
	//! Delete all of user's comments.
	deleteUserCommentsPassword: string; //* Password: "CANTJUMP" inputted
	userCommentsIsDeleted: boolean; //* If the password is correct for "deleteUserCommentsPassword", and they click the "Delete All My Comments" button, set to true.
	openDeleteUserCommentsModal: boolean; //* User has clicked on the "Delete All My Comments" button.
	//! Delete all of user's videos
	deleteUserVideosPassword: string; //* Password: "HOOSIER"
	userVideosIsDeleted: boolean; //* If the password is correct for "deleteUserVideosPassword", and they click the "Delete All of My Videos" button, set to true.
	openDeleteUserVideosModal: boolean; //* User has clicked on the "Delete All of My Videos" button.
	//? React-Router-V6
	redirect: boolean;
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
			deleteUserAccountPassword: "",
			userIsDeleted: false,
			openDeleteUserModal: false,
			//! Delete the Comments
			deleteUserCommentsPassword: "",
			userCommentsIsDeleted: false,
			openDeleteUserCommentsModal: false,
			//! Delete the Videos,
			deleteUserVideosPassword: "",
			userVideosIsDeleted: false,
			openDeleteUserVideosModal: false,
			//? React-Router-V6
			redirect: false,
		};
		this.handleSubmitUpdatePassword =
			this.handleSubmitUpdatePassword.bind(this);
		this.handleSubmitUpdateUsername =
			this.handleSubmitUpdateUsername.bind(this);
		this.handleSubmitUpdateEmailAddress =
			this.handleSubmitUpdateEmailAddress.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeMUI = this.handleChangeMUI.bind(this);
		this.accountResetAnswer1 = this.accountResetAnswer1.bind(this);
		this.accountResetAnswer2 = this.accountResetAnswer2.bind(this);
		this.didUserAnswerAccountResetAnswersCorrectlySubmit =
			this.didUserAnswerAccountResetAnswersCorrectlySubmit.bind(this);
		this.newPasswordInput = this.newPasswordInput.bind(this);
		this.confirmNewPasswordInput = this.confirmNewPasswordInput.bind(this);
		this.passwordInput = this.passwordInput.bind(this);
		this.deleteUserAccountSubmit = this.deleteUserAccountSubmit.bind(this);
		this.deleteUserCommentsSubmit = this.deleteUserCommentsSubmit.bind(this);
		this.deleteUserVideosSubmit = this.deleteUserVideosSubmit.bind(this);
		this.openModalUserAccountDelete =
			this.openModalUserAccountDelete.bind(this);
		this.openModalUserCommentsDelete =
			this.openModalUserCommentsDelete.bind(this);
		this.openModalUserVideosDelete = this.openModalUserVideosDelete.bind(this);
		this.renderDeleteUserAccountModalmui =
			this.renderDeleteUserAccountModalmui.bind(this);
		this.renderDeleteUserCommentsModalmui =
			this.renderDeleteUserCommentsModalmui.bind(this);
		this.renderDeleteUserVideosModalmui =
			this.renderDeleteUserVideosModalmui.bind(this);
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
	//* LIFECYCLE METHOD
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

	//? ChangeEvent: Section
	//* This can be condensed into a single function.

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

	handleChangeMUI(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			...this.state,
			[event.target.name]: event.target.value,
		});
	}

	handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value,
		});
	};

	//? Update User Settings: Section

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

	//? Delete User Content: Section

	//! Start: Delete User
	openModalUserAccountDelete = (): void => {
		this.setState({
			openDeleteUserModal: !this.state.openDeleteUserModal,
		});
	};

	deleteUserAccountSubmit = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			(this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === "") &&
			this.state.deleteUserAccountPassword !== "IHATEBASKETBALL"
		) {
			this.setState({
				errorMessage: "Please answer the account reset questions.",
			});
		} else {
			if (this.state.deleteUserAccountPassword === "IHATEBASKETBALL")
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
							console.log("Delete User data: " + data);
							this.props.setResponseStatus(data.status);
							this.props.clearToken();
							this.state.redirect && <Navigate to="/" replace={true} />;
						}
						this.setState({
							errorMessage: data.message,
							responseStatus: data.status,
							openDeleteUserModal: false,
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

	renderDeleteUserAccountModalmui = (): JSX.Element => {
		return (
			<div>
				<Dialog open={true} onClose={this.openModalUserVideosDelete}>
					<DialogTitle>Delete Account</DialogTitle>
					<DialogContent>
						<DialogContentText>
							In order to delete all your account, please enter
							"IHATEBASKETBALL" into the text field below. After doing so, click
							"Delete My Account". This is final. You will not be able to
							recover your account.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="deleteUserCommentTextField"
							name="deleteUserAccountPassword"
							label="Confirm Delete"
							type="text"
							fullWidth
							placeholder="IHATEBASKETBALL"
							variant="standard"
							onChange={this.handleChangeMUI}
							value={this.state.deleteUserAccountPassword}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.openModalUserAccountDelete}>Cancel</Button>
						<Button onClick={this.deleteUserAccountSubmit}>
							Delete My Account
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};
	//! End: Delete User

	//! Start: Delete All Videos
	openModalUserVideosDelete = (): void => {
		this.setState({
			openDeleteUserVideosModal: !this.state.openDeleteUserVideosModal,
		});
	};

	deleteUserVideosSubmit = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			(this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === "") &&
			this.state.deleteUserVideosPassword !== "HOOSIER"
		) {
			this.setState({
				errorMessage: "Please type 'HOOSIER' if you wish to delete your videos.",
			});
		} else {
			if (this.state.deleteUserVideosPassword === "HOOSIER")
				await fetch(`${dbCall}/videos/content/${this.props.id}`, {
					method: "DELETE",
					headers: new Headers({
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.props.sessionToken}`,
					}),
				})
					.then((res) => {
						console.log("Delete Videos status is: " + res.status);
						this.props.setResponseStatus(res.status);
						this.openModalUserVideosDelete();
						return res.json();
					})
					.then((data) => {
						if (
							data.status === 200 &&
							data.message === "Videos successfully deleted!"
						) {
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

	renderDeleteUserVideosModalmui = (): JSX.Element => {
		return (
			<div>
				<Dialog open={true} onClose={this.openModalUserVideosDelete}>
					<DialogTitle>Delete All Videos</DialogTitle>
					<DialogContent>
						<DialogContentText>
							In order to delete all of your videos, please enter "HOOSIER" into
							the text field below. After doing so, click "Delete All My
							Videos". This is final. You will not be able to recover your
							account.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="deleteUserCommentTextField"
							name="deleteUserVideosPassword"
							label="Confirm Delete"
							type="text"
							fullWidth
							placeholder="HOOSIER"
							variant="standard"
							onChange={this.handleChangeMUI}
							value={this.state.deleteUserVideosPassword}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.openModalUserVideosDelete}>Cancel</Button>
						<Button onClick={this.deleteUserVideosSubmit}>
							Delete All My Videos
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};
	//! End: Delete All Videos

	//! Start: Delete All Comments
	openModalUserCommentsDelete = (): void => {
		this.setState({
			// if the modal is open, set the state to true. Otherwise, set it to false.
			openDeleteUserCommentsModal: !this.state.openDeleteUserCommentsModal,
		});
	};

	deleteUserCommentsSubmit = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === ""
		) {
			this.setState({
				errorMessage: "Please answer the account reset questions.",
			});
		} else {
			if (this.state.deleteUserCommentsPassword === "CANTJUMP")
				await fetch(`${dbCall}/comments/${this.props.id}`, {
					method: "DELETE",
					headers: new Headers({
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.props.sessionToken}`,
					}),
				})
					.then((res) => {
						console.log("Delete Comments status is: " + res.status);
						this.openModalUserCommentsDelete();
						this.props.setResponseStatus(res.status);
						return res.json();
					})
					.then((data) => {
						if (
							data.status === 200 &&
							data.message === "Comments successfully deleted!"
						) {
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

	renderDeleteUserCommentsModalmui = (): JSX.Element => {
		return (
			<div>
				<Dialog open={true} onClose={this.openModalUserCommentsDelete}>
					<DialogTitle>Delete All Comments</DialogTitle>
					<DialogContent>
						<DialogContentText>
							In order to delete all your comments, please enter "CANTJUMP" into
							the text field below. After doing so, click "Delete All My
							Comments". This is final. You will not be able to recover your
							account.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="deleteUserCommentTextField"
							name="deleteUserCommentsPassword"
							label="Confirm Delete"
							type="text"
							fullWidth
							placeholder="CANTJUMP"
							variant="standard"
							onChange={this.handleChangeMUI}
							value={this.state.deleteUserCommentsPassword}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.openModalUserCommentsDelete}>Cancel</Button>
						<Button onClick={this.deleteUserCommentsSubmit}>
							Delete All My Comments
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};
	//! End: Delete All Comments

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
					<div className="showResetOptions">
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
						{/* DELETE SECTION */}
						<div className="account-reset-delete-container">
							<div className="account-reset-delete-button-container">
								<button
									onClick={this.openModalUserAccountDelete}
									className="account-reset-delete-button"
								>
									Delete Account
								</button>
							</div>

							<div className="account-reset-delete-button-container">
								<button
									onClick={this.openModalUserVideosDelete}
									className="account-reset-delete-button"
								>
									Delete All Videos
								</button>
							</div>

							<div className="account-reset-delete-button-container">
								<button
									onClick={this.openModalUserCommentsDelete}
									className="account-reset-delete-button"
								>
									Delete All Comments
								</button>
							</div>

							{this.state.openDeleteUserModal
								? this.renderDeleteUserAccountModalmui()
								: null}

							{this.state.openDeleteUserVideosModal
								? this.renderDeleteUserVideosModalmui()
								: null}

							{this.state.openDeleteUserCommentsModal
								? this.renderDeleteUserCommentsModalmui()
								: null}
						</div>
					</div>
				) : //TODO conditionals for modals showing up

				null}
			</div>
		);
	}
	//* LIFECYCLE METHOD
	componentWillUnmount() {
		this.setState({
			openDeleteUserModal: false,
			openDeleteUserVideosModal: false,
			openDeleteUserCommentsModal: false,
		}
		);
	}
}


