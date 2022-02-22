import React, { Component } from 'react';
import dbCall from "../helpers/Environments";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BrowserRouter as Route, Link } from "react-router-dom";
import { ABCtoken, ABCuserInfo, ABCcalls, ABCvideo } from '../App';

interface MyParkProps {
	//? Video Props
	setVideoId: ABCvideo["setVideoId"];
	setVideoTitle: ABCvideo["setVideoTitle"];
	setVideoLink: ABCvideo["setVideoLink"];
	setVideoOwner: ABCvideo["setVideoOwner"];
	setVideoOwnerUsername: ABCvideo["setVideoOwnerUsername"];
	//? ABCcalls
	errorMessage: ABCcalls["errorMessage"];
	setErrorMessage: ABCcalls["setErrorMessage"];
	responseStatus: ABCcalls["responseStatus"];
	setResponseStatus: ABCcalls["setResponseStatus"];
	//? userInfo
    id: ABCuserInfo["id"];
	isUserLoggedIn: ABCtoken["isUserLoggedIn"];
	sessionToken: ABCtoken["sessionToken"];
	isAdmin: ABCuserInfo["isAdmin"];
    navigate: ABCcalls["navigate"];
    username: ABCuserInfo["username"];
}

interface MyParkVideosState {
	videoId: string;
	videoTitle: string;
	videoLink: string;
	videoOwner: string;
	videoOwnerId: string;
	videoOwnerUsername: string;
	videoPostsArray: string[];
	isVideoEditModalOpen: boolean;
	editVideoTitleText: string;
	editVideoLinkText: string;
}

export default class MyParkVideos extends Component<MyParkProps, MyParkVideosState> {
	constructor(props: MyParkProps) {
		super(props);
		this.state = {
			videoId: "",
			videoTitle: "",
			videoLink: "",
			videoOwner: "",
			videoOwnerId: "",
			videoOwnerUsername: "",
			videoPostsArray: [],
			isVideoEditModalOpen: false,
			editVideoTitleText: "",
			editVideoLinkText: "",
		};
		this.handleChangeMUI = this.handleChangeMUI.bind(this);
		this.isVideoEditModalOpenConditional =
			this.isVideoEditModalOpenConditional.bind(this);
		this.renderVideoEditModal = this.renderVideoEditModal.bind(this);
		this.updateVideoTitleSubmit = this.updateVideoTitleSubmit.bind(this);
		this.deleteVideoSubmit = this.deleteVideoSubmit.bind(this);
	}

	handleChangeMUI(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			...this.state,
			[event.target.name]: event.target.value,
		});
	}

	fetchVideoArray = async () => {
		await fetch(`${dbCall}/videos/content/all`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error fetching videos");
				}
			})
			.then((responseJson) => {
				console.log("Home :", responseJson);
				this.setState({
					// set the data to a array of videos
					videoPostsArray: responseJson.allVideos,
				});
				console.log("Videos: ", this.state.videoPostsArray);
			})
			.catch((err) => {
				this.props.setErrorMessage(err.message);
				console.log("Error with fetchVideos: ", err);
			});
	};

	//! VIDEO POSTS
	isVideoEditModalOpenConditional = (
		videoId: string,
		videoOwnerId: string,
		videoTitle: string,
		videoLink: string
	) => {
		this.setState({
			...this.state,
			isVideoEditModalOpen: !this.state.isVideoEditModalOpen,
			videoId: videoId,
			videoOwnerId: videoOwnerId,
			videoTitle: videoTitle,
			videoLink: videoLink,
		});
	};

	renderVideoEditModal = (): JSX.Element => {
		return (
			<Dialog
				open={this.state.isVideoEditModalOpen}
				onClose={() => {
					this.isVideoEditModalOpenConditional(
						this.state.videoId,
						this.state.videoOwnerId,
						this.state.videoTitle,
						this.state.videoLink
					);
				}}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Edit Your Video</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Update your video information below. You can also delete your video.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="editVideoTitleText"
						name="editVideoTitleText"
						label="Video Title"
						type="text"
						multiline
						placeholder={this.state.videoTitle}
						value={this.state.editVideoTitleText}
						fullWidth
						onChange={this.handleChangeMUI}
					/>
					<TextField
						margin="dense"
						id="editVideoLinkText"
						name="editVideoLinkText"
						label="Video Link"
						type="text"
						placeholder={this.state.videoLink}
						value={this.state.editVideoLinkText}
						fullWidth
						onChange={this.handleChangeMUI}
					/>
				</DialogContent>
				<DialogActions>
					<Link to="/">
						<Button onClick={() => this.deleteVideoSubmit} color="secondary">
							Delete
						</Button>
					</Link>
					<Button
						onClick={() => {
							this.isVideoEditModalOpenConditional(
								this.state.videoId,
								this.state.videoOwnerId,
								this.state.videoTitle,
								this.state.videoLink
							);
						}}
						color="primary"
					>
						Cancel
					</Button>

					<Button onClick={this.updateVideoTitleSubmit} color="primary">
						Update
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	updateVideoTitleSubmit = async () => {
		await fetch(
			`${dbCall}/videos/content/${this.props.id}/${this.state.videoId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				},
				body: JSON.stringify({
					videopost: {
						videoTitle: this.state.editVideoTitleText,
						videoLink: this.state.editVideoLinkText,
					},
				}),
			}
		)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Error updating video title");
				}
			})
			.then((responseJson) => {
				console.log("Video :", responseJson);
				this.setState({
					...this.state,
					isVideoEditModalOpen: false,
					editVideoTitleText: "",
				});
				this.props.setVideoLink(responseJson.videoLink);
				this.props.setVideoTitle(responseJson.videoTitle);
				this.props.setVideoId(responseJson.videoId);
				this.props.setVideoOwner(responseJson.userId);
				this.props.setVideoOwnerUsername(responseJson.videoOwnerUsername);
				this.fetchVideoArray();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	deleteVideoSubmit = async (userId: string, videoId: string) => {
		if (window.confirm("Are you sure you want to delete this video?")) {
			await fetch(`${dbCall}/videos/content/${userId}/${videoId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				},
			})
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
						...this.state,
						videoTitle: "",
						videoLink: "",
					});
					this.props.setVideoLink("");
					this.props.setVideoTitle("");
					this.props.setVideoId("");
					this.props.setVideoOwner("");
					this.props.setVideoOwnerUsername("");
					console.log("Admin State:", this.state);
					this.fetchVideoArray();
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	componentDidMount() {}

	render() {
        return <div>
            
        </div>;
	}
}