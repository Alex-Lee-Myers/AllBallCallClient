import React, { Component, Fragment } from "react";
import ReactPlayer from "react-player";
import { ABCvideo, ABCuserInfo, ABCtoken } from "../App";
import { StarIcon } from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";
import { BrowserRouter as Route, Link, Navigate } from "react-router-dom";
import dbCall from "../helpers/Environments";
import tempProfilePic from "../images/temp_prof_pic.jpg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface videoProps {
	videoId: ABCvideo["videoId"];
	videoTitle: ABCvideo["videoTitle"];
	videoLink: ABCvideo["videoLink"];
	username: ABCuserInfo["username"];
	id: ABCuserInfo["id"];
	isAdmin: ABCuserInfo["isAdmin"];
	isUserLoggedIn: ABCtoken["isUserLoggedIn"];
	sessionToken: ABCtoken["sessionToken"];
}

interface VideoState {
	commentText: string;
	videoId: string;
	videoTitle: string;
	videoLink: string;
	videoOwner: string;
	videoOwnerId: string;
	videoOwnerUsername: string;
	videoPostsArray: string[];
	commentsArray: string[];
	//? Return Conditionals
	isVideoOwner: boolean;
	deleteCommentId: any;
	editCommentId: string;
	editCommentText: string;
	isCommentOwner: boolean;
	isPostCommentModalOpen: boolean;
	isEditCommentModalOpen: boolean;
	isCommentDeleteModalOpen: boolean;
	editVideoTitleText: string;
	isVideoEditModalOpen: boolean;
	isVideoDeleteModalOpen: boolean;
}

interface renderClassNames {
	classNames: Function;
}

export default class Video extends Component<
	videoProps,
	{
		VideoState: VideoState;
		renderClassNames: renderClassNames;
	}
> {
	constructor(props: videoProps) {
		super(props);
		this.state = {
			VideoState: {
				commentText: "",
				videoId: this.props.videoId,
				videoTitle: this.props.videoTitle,
				videoLink: this.props.videoLink,
				videoOwner: "",
				videoOwnerId: "",
				videoOwnerUsername: "",
				videoPostsArray: [],
				commentsArray: [],
				//? Return Conditionals
				isVideoOwner: false,
				deleteCommentId: "",
				editCommentId: "",
				editCommentText: "",
				isCommentOwner: false,
				isPostCommentModalOpen: false,
				isEditCommentModalOpen: false,
				isCommentDeleteModalOpen: false,
				editVideoTitleText: "",
				isVideoEditModalOpen: false,
				isVideoDeleteModalOpen: false,
			},
			renderClassNames: {
				classNames: function (...classes: string[]) {
					return classes.filter(Boolean).join(" ");
				},
			},
		};
		this.fetchCommentsArray = this.fetchCommentsArray.bind(this);
		this.postCommentSubmit = this.postCommentSubmit.bind(this);
		this.editCommentSubmit = this.editCommentSubmit.bind(this);
		this.renderEditCommentModal = this.renderEditCommentModal.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.editVideo = this.editVideo.bind(this);
		this.deleteVideo = this.deleteVideo.bind(this);
		this.handleChangeMUI = this.handleChangeMUI.bind(this);
	}

	handleChangeMUI(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			VideoState: {
				...this.state.VideoState,
				[event.target.name]: event.target.value,
			},
		});
	}

	//! COMMMENTS
	//TODO: rerender comments on comment edit/delete/post
	fetchCommentsArray = async () => {
		await fetch(`${dbCall}/comments/${this.props.videoId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.props.sessionToken}`,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error fetching this video's comments");
				}
			})
			.then((responseJson) => {
				console.log("Video :", responseJson);
				this.setState({
					VideoState: {
						...this.state.VideoState,
						commentsArray: responseJson.allComments,
					},
				});
				console.log("Comments Array:", this.state.VideoState.commentsArray);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//? Post Comment
	isPostCommentModalOpenConditional = (): void => {
		this.setState({
			VideoState: {
				...this.state.VideoState,
				isPostCommentModalOpen: !this.state.VideoState.isPostCommentModalOpen,
			},
		});
	};

	//TODO make it a bigger text box
	renderPostCommentModal = (): JSX.Element => {
		return (
			<Dialog
				open={this.state.VideoState.isPostCommentModalOpen}
				onClose={this.isPostCommentModalOpenConditional}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Post a Comment</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter your comment below.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="commentText"
						name="commentText"
						label="Comment"
						type="text"
						value={this.state.VideoState.commentText}
						fullWidth
						onChange={this.handleChangeMUI}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={this.isPostCommentModalOpenConditional}
						color="primary"
					>
						Cancel
					</Button>
					<Button onClick={this.postCommentSubmit} color="primary">
						Post
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	postCommentSubmit = async () => {
		console.log("Post Comment Submit: ", this.state.VideoState.commentText);
		await fetch(`${dbCall}/comments/${this.props.videoId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.props.sessionToken}`,
			},
			body: JSON.stringify({
				comments: {
					commentText: this.state.VideoState.commentText,
				},
			}),
		})
			.then((response) => {
				return response.json();
			})
			.then((responseJson) => {
				console.log("Video :", responseJson);
				this.setState({
					VideoState: {
						...this.state.VideoState,
						isPostCommentModalOpen: false,
						commentText: "",
					},
				});
				console.log("Comments Array:", this.state.VideoState.commentsArray);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//? Edit Comment
	//* User hits edit comment button, opens the Edit Comment Modal (renderEditCommentModal).
	isEditCommentModalOpenConditional = (): void => {
		this.setState({
			VideoState: {
				...this.state.VideoState,
				isEditCommentModalOpen: !this.state.VideoState.isEditCommentModalOpen,
			},
		});
	};
	//* The user inputs the text, and pass through the comment id. 
	renderEditCommentModal = (commentId: string, commentText: string): JSX.Element => {
		return (
			<div className="edit-comment-container">
				<Dialog open={true} onClose={this.isEditCommentModalOpenConditional}>
					<DialogContent>
						<DialogContentText>Edit your comments.</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="commentText"
							name="commentText"
							label="Edit Comment"
							type="text"
							fullWidth
							placeholder="HOOSIER"
							variant="standard"
							onChange={this.handleChangeMUI}
							value={this.state.VideoState.commentText}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={this.isEditCommentModalOpenConditional}
							color="primary"
						>
							Cancel
						</Button>
						<Button onClick={this.editCommentSubmit(commentId, CommentText)} color="primary">
							Edit
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};

	editCommentSubmit = async (
		e: React.MouseEvent<HTMLButtonElement>,
		commentId: string,
		commentText: string
	) => {
		e.preventDefault();

		await fetch(`${dbCall}/comments/${this.props.videoId}/${commentId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.props.sessionToken}`,
			},
			body: JSON.stringify({
				commentText: commentText,
			}),
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error editing comment");
				}
			})
			.then((responseJson) => {
				console.log("Video :", responseJson);
				this.setState({
					VideoState: {
						...this.state.VideoState,
						commentsArray: responseJson.allComments,
					},
				});
				console.log("Comments Array:", this.state.VideoState.commentsArray);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//? Delete Comment
	deleteComment = async (commentId: string) => {
		// confirm delete comment before running the fetch
		if (window.confirm("Are you sure you want to delete this comment?")) {
			await fetch(`${dbCall}/comments/${this.props.videoId}/${commentId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				},
			})
				.then((response) => {
					if (response.status === 201) {
						return response.json();
					} else {
						throw new Error("Error deleting comment");
					}
				})
				.then((responseJson) => {
					console.log("Video :", responseJson);
					this.setState({
						VideoState: {
							...this.state.VideoState,
							commentsArray: responseJson.allComments,
						},
					});
					console.log("Comments Array:", this.state.VideoState.commentsArray);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	//! VIDEO POSTS
	editVideo = async () => {
		await fetch(
			`${dbCall}/videos/content/${this.props.id}/${this.props.videoId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				},
				body: JSON.stringify({
					videoTitle: this.state.VideoState.videoTitle,
					videoLink: this.props.videoLink,
				}),
			}
		)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error editing video");
				}
			})
			.then((responseJson) => {
				console.log("Video Update :", responseJson);
				this.setState({
					VideoState: {
						...this.state.VideoState,
						videoTitle: responseJson.videoTitle,
						videoLink: responseJson.videoLink,
					},
				});
				console.log("Video State:", this.state.VideoState);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	deleteVideo = async () => {
		await fetch(
			`${dbCall}/videos/content/${this.props.id}/${this.props.videoId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				},
			}
		)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error deleting video");
				}
			})
			.then((responseJson) => {
				console.log("Video Update :", responseJson);
				this.setState({
					VideoState: {
						...this.state.VideoState,
						videoTitle: "",
						videoLink: "",
					},
				});
				console.log("Video State:", this.state.VideoState);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//! VIDEO RENDER

	// componentWillMount() {

	// }

	componentDidMount() {
		this.fetchCommentsArray();
	}

	// componentWillReceiveProps(nextProps) {

	// }

	// shouldComponentUpdate(nextProps, nextState) {

	// }

	// componentWillUpdate(nextProps, nextState) {

	// }

	// componentDidUpdate(prevProps, prevState) {

	// }

	// componentWillUnmount() {

	// }

	render() {
		return (
			<div className="bg-white">
				<div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
					{/* Video */}
					<div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
						{/* Video Highlight */}
						<div className="lg:row-end-1 lg:col-span-4">
							<div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
								<ReactPlayer
									width={"100%"}
									height={"100%"}
									url={this.state.VideoState.videoLink}
									alt={this.state.VideoState.videoTitle}
									className="object-center object-cover shadow-2xl"
								/>
							</div>
						</div>

						{/* Video details */}
						<div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
							<div className="flex flex-col-reverse">
								<div className="mt-4">
									<h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
										{this.state.VideoState.videoTitle}
									</h1>

									<h2 id="information-heading" className="sr-only">
										Video information
									</h2>
									<p className="text-sm text-gray-500 mt-2">
										Game Date:
										<time dateTime="">
											{" "}
											{/*{this.state.videoState.dateTime}*/}{" "}
										</time>
									</p>
								</div>

								<div>
									<h3 className="sr-only">FG%</h3>
									<div className="flex items-center">
										{/* {[0, 1, 2, 3, 4].map((rating) => (
													<StarIcon
														key={this.state.videoState.likes}
														className={classNames(
															this.state.videoState.likes > rating
																? "text-yellow-400"
																: "text-gray-300",
															"h-5 w-5 flex-shrink-0"
														)}
														aria-hidden="true"
													/>
												))} */}
									</div>
									<p className="sr-only">
										{/* Likes: {this.state.videoState.likes} | Dislikes: {this.state.videoState.dislikes}*/}
									</p>
								</div>
							</div>

							<p className="text-gray-500 mt-6">{/* {videos.description}*/}</p>

							<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
								<button
									onClick={this.isPostCommentModalOpenConditional}
									type="button"
									className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
								>
									Comment {/* {comment button} */}
								</button>

								{this.state.VideoState.isPostCommentModalOpen
									? this.renderPostCommentModal()
									: null}

								<button
									type="button"
									className="w-full bg-indigo-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
								>
									Chexx {/* {this.state.videoState.videoOwner} */}
								</button>
							</div>

							<div className="border-t border-gray-200 mt-10 pt-10">
								<h3 className="text-sm font-medium text-gray-900">Players</h3>
								<div className="mt-4 prose prose-sm text-gray-500">
									{/* <ul role="list">
												{videos.highlightedPlayers.map((player) => (
													<li key={player.id}>{player}</li>
												))}
											</ul> */}
								</div>
							</div>

							<div className="border-t border-gray-200 mt-10 pt-10">
								<h3 className="text-sm font-medium text-gray-900">Tags</h3>
								{/* <p className="mt-4 text-sm text-gray-500">
											{tagsArray.idk}{" "}
											<a
												href={tags.href}
												className="font-medium text-indigo-600 hover:text-indigo-500"
											>
												Tags Here
											</a>
										</p> */}
							</div>

							<div className="border-t border-gray-200 mt-10 pt-10">
								<h3 className="text-sm font-medium text-gray-900">Share</h3>
								<ul className="flex items-center space-x-6 mt-4">
									<li>
										<a
											href="#"
											className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
										>
											<span className="sr-only">Share on Facebook</span>
											<svg
												className="w-5 h-5"
												aria-hidden="true"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
													clipRule="evenodd"
												/>
											</svg>
										</a>
									</li>
									<li>
										<a
											href="#"
											className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
										>
											<span className="sr-only">Share on Instagram</span>
											<svg
												className="w-6 h-6"
												aria-hidden="true"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													fillRule="evenodd"
													d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
													clipRule="evenodd"
												/>
											</svg>
										</a>
									</li>
									<li>
										<a
											href="#"
											className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500"
										>
											<span className="sr-only">Share on Twitter</span>
											<svg
												className="w-5 h-5"
												aria-hidden="true"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
											</svg>
										</a>
									</li>
								</ul>
							</div>
						</div>

						{/* If you are not logged in, tell the guest to be able to see comments, login or register and link them to those pages */}
						{this.props.isUserLoggedIn === false ? (
							<div className="mt-8">
								<div className="text-center">
									<p className="text-sm leading-5 text-gray-500">
										To comment, login or register.
									</p>
									<div className="mt-4">
										<Link
											to="/login"
											className="text-sm leading-5 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
										>
											Login
										</Link>
									</div>
									<div className="mt-4">
										<Link
											to="/register"
											className="text-sm leading-5 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
										>
											Register
										</Link>
									</div>
								</div>
							</div>
						) : (
							<ul className="mt-4">
								{this.state.VideoState.commentsArray?.map((comment: any) => {
									return (
										<li key={comment.commentID}>
											<div className="flex items-center">
												<div className="flex-shrink-0">
													<img
														className="h-10 w-10 rounded-full"
														src={tempProfilePic}
														alt={comment.user.username}
													/>
												</div>
												<div className="ml-4">
													<div className="text-sm leading-5 font-medium text-gray-900">
														{comment.user.username}
													</div>
													<div className="mt-2 text-sm leading-5 text-gray-600">
														{comment.commentText}
													</div>
												</div>
												{/* If  comment.user.id === this.props.id of the commentID, then show a button that opens a MUI modal of a text box with a submit button that onSubmit={this.editVideo} */}
												{comment.user.id === this.props.id && (
													<div className="ml-auto text-sm leading-5 text-gray-600">
														<button
															className="text-xs font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:underline transition ease-in-out duration-150"
															onClick={() => {
																this.isEditCommentModalOpenConditional();
															}}
														>
															Edit
														</button>

														{this.state.VideoState.isEditCommentModalOpen
															? this.renderEditCommentModal(comment.commentID, comment.commentText)
															: null}

														<button
															className="text-xs font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:underline transition ease-in-out duration-150"
															onClick={() => {
																this.deleteComment(comment.commentID);
															}}
														>
															Delete
														</button>
													</div>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			</div>
		);
	}
}
