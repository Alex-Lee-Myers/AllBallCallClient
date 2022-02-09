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
	openDeleteUserModal: boolean; //* User has clicked on the "Delete My Account" button.
	//! Delete all of user's comments.
	showDeleteUserCommentsModal: boolean; //* User has clicked on modal to open prompting them to delete all of their comments.
	deleteUserCommentsPassword: string; //* Password: "CANTJUMP" inputted
	userCommentsIsDeleted: boolean; //* If the password is correct for "deleteUserCommentsPassword", and they click the "Delete All My Comments" button, set to true.
	openDeleteUserCommentsModal: boolean; //* User has clicked on the "Delete All My Comments" button.
	//! Delete all of user's videos
	showDeleteUserVideosModal: boolean; //* User has clicked on modal to open prompting them to delete all of their videos.
	deleteUserVideosPassword: string; //* Password: "HOOSIER"
	userVideosIsDeleted: boolean; //* If the password is correct for "deleteUserVideosPassword", and they click the "Delete All of My Videos" button, set to true.
	openDeleteUserVideosModal: boolean; //* User has clicked on the "Delete All of My Videos" button.
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
			openDeleteUserModal: false,
			//! Delete the Comments
			showDeleteUserCommentsModal: false,
			deleteUserCommentsPassword: "",
			userCommentsIsDeleted: false,
			openDeleteUserCommentsModal: false,
			//! Delete the Videos,
			showDeleteUserVideosModal: false,
			deleteUserVideosPassword: "",
			userVideosIsDeleted: false,
			openDeleteUserVideosModal: false,
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
		this.openModalUserDelete = this.openModalUserDelete.bind(this);
		this.openModalUserCommentsDelete =
			this.openModalUserCommentsDelete.bind(this);
		this.openModalUserVideosDelete = this.openModalUserVideosDelete.bind(this);
		this.deleteUserModal = this.deleteUserModal.bind(this);
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

	//! handleChange() is called when the user changes the value of a form input.
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
	openModalUserDelete = (): void => {
		this.setState({
			openDeleteUserModal: !this.state.openDeleteUserModal,
		});
	};

	deleteUserModal = (): JSX.Element => {
		//! Delete User Modal
		return (
			<div
				className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center md:inset-0 h-modal sm:h-full"
				id="popup-modal"
			>
				<div className="relative px-4 w-full max-w-md h-full md:h-auto">
					{/* Modal content */}
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						{/* Modal header */}
						<div className="flex justify-end p-2">
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
								data-modal-toggle="popup-modal"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
						</div>
						{/* Modal body */}
						<div className="p-6 pt-0 text-center">
							<svg
								className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
								Are you sure?
							</h3>
							<form
								className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8"
								onSubmit={this.deleteUserSubmit}
							>
								<h3 className="text-xl font-medium text-gray-900 dark:text-white">
									Please enter the prompt below in order to delete your account.
								</h3>
								<div>
									<label
										htmlFor="text"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
									>
										Account Deletion Confirmation
									</label>
									<input
										type="text"
										name="text"
										id="text"
										onChange={this.handleChange}
										value={this.state.deleteUserPassword}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
										placeholder="Type 'I HATE BASKETBALL' to confirm."
										required
									></input>
								</div>
								<button
									data-modal-toggle="popup-modal"
									type="button"
									className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
								>
									Yes, I'm sure
								</button>
							</form>
							<button
								data-modal-toggle="popup-modal"
								type="button"
								className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
							>
								No, cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	deleteUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			(this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === "") &&
			this.state.deleteUserPassword === "I HATE BASKETBALL"
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
	//! End: Delete User

	//! Start: Delete All Videos
	openModalUserVideosDelete = (): void => {
		this.setState({
			openDeleteUserVideosModal: !this.state.openDeleteUserVideosModal,
		});
	};

	deleteUserVideosSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			(this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === "") &&
			this.state.deleteUserVideosPassword === "HOOSIER"
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

	deleteUserVideosModal = (): JSX.Element => {
		//! Delete Videos Modal
		return (
			<div
				className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center md:inset-0 h-modal sm:h-full"
				id="popup-modal"
			>
				<div className="relative px-4 w-full max-w-md h-full md:h-auto">
					{/* Modal content */}
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						{/* Modal header */}
						<div className="flex justify-end p-2">
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
								data-modal-toggle="popup-modal"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
						</div>
						{/* Modal body */}
						<div className="p-6 pt-0 text-center">
							<svg
								className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
								Are you sure?
							</h3>
							<form
								className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8"
								onSubmit={this.deleteUserVideosSubmit}
							>
								<h3 className="text-xl font-medium text-gray-900 dark:text-white">
									Please enter the prompt below in order to delete all your
									videos.
								</h3>
								<div>
									<label
										htmlFor="text"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
									>
										Videos Deletion Confirmation
									</label>
									<input
										type="text"
										name="text"
										id="text"
										onChange={this.handleChange}
										value={this.state.deleteUserVideosPassword}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
										placeholder="Type 'HOOSIER' to confirm."
										required
									></input>
								</div>
								<button
									data-modal-toggle="popup-modal"
									type="button"
									className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
								>
									Yes, I'm sure
								</button>
							</form>
							<button
								data-modal-toggle="popup-modal"
								type="button"
								className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
							>
								No, cancel
							</button>
						</div>
					</div>
				</div>
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

	deleteUserCommentsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await this.didUserAnswerAccountResetAnswersCorrectlySubmit;
		if (
			(this.state.accountResetAnswer1 === "" ||
				this.state.accountResetAnswer2 === "") &&
			this.state.deleteUserVideosPassword === "CANTJUMP"
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

	deleteUserCommentsModal = (): JSX.Element => {
		//! Delete Comments Modal
		return (
			<div
				className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center md:inset-0 h-modal sm:h-full"
				id="popup-modal"
			>
				<div className="relative px-4 w-full max-w-md h-full md:h-auto">
					{/* Modal content */}
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						{/* Modal header */}
						<div className="flex justify-end p-2">
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
								data-modal-toggle="popup-modal"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
						</div>
						{/* Modal body */}
						<div className="p-6 pt-0 text-center">
							<svg
								className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
								Are you sure?
							</h3>
							<form
								className="px-6 pb-4 space-y-6 lg:px-8 sm:pb-6 xl:pb-8"
								onSubmit={this.deleteUserCommentsSubmit}
							>
								<h3 className="text-xl font-medium text-gray-900 dark:text-white">
									Please enter the prompt below in order to delete all your
									comments.
								</h3>
								<div>
									<label
										htmlFor="text"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
									>
										Comments Deletion Confirmation
									</label>
									<input
										type="text"
										name="text"
										id="text"
										onChange={this.handleChange}
										value={this.state.deleteUserCommentsPassword}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
										placeholder="Type 'HOOSIER' to confirm."
										required
									></input>
								</div>
								<button
									data-modal-toggle="popup-modal"
									type="button"
									className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
								>
									Yes, I'm sure
								</button>
							</form>
							<button
								data-modal-toggle="popup-modal"
								type="button"
								className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
							>
								No, cancel
							</button>
						</div>
					</div>
				</div>
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
									onClick={this.openModalUserDelete}
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
						</div>
					</div>

				// 	<div>
				// {this.state.openDeleteUserModal && (
				// 	this.state.deleteUserModal 
				// )</div> : null }
			
				//TODO conditionals for modals showing up
					
				) : null}
			</div>
		);
	}
}
