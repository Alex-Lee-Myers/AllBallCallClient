import React from "react";
import { useNavigate } from "react-router-dom";
import dbCall from "../helpers/Environments";
import { ABCtoken, ABCvideo, ABCuserInfo, ABCcalls } from "../App";

// !VideoPost information:
//     //? What does this file do?
//         //? This file is used to post the video to the database.
//         //? It is a class component.
//         //? It must come from a user with a sessionToken.
//         //? It will have an async function that await fetch posts to the endpoint: `${dbCall}/videos/content/`
//         //? The req.body.videopost is the following:
//             //* videoTitle, videoLink, thumbnailImage, playersHighlighted, teamsFeatured, tags, gameDate, nbaSeason, isPlayoffs, clutch.
//         //? It will be posting the following information:
//             //*
//             //* - videoTitle: The title of the video.
//             //* - videoLink: The link to the video. It can be a YouTube or Streamable link.
//             //* - thumbnailImage: Optional. The thumbnail image of the video.
//             //* - playersHighlighted: Optional. The players highlighted in the video.
//             //* - teamsFeatured: Optional. The teams featured in the video. Max of 2 teams.
//             //* - tags: Optional. The tags of the video. Will be incoroporated later with autocomplete feature.
//             //* - gameDate: Optional. The date of the game.
//             //* - nbaSeason: Optional. The NBA season of the game. Format will be YYYY-YYYY.
//             //* - isPlayoffs: Optional. If the game was a playoff game.
//             //* - clutch: Optional. If the highlight takes place in clutch time.
//             //* - adminHighlighted: Optional. If the highlight was marked for being featured on home page. Default is false in backend.
//             //* - adminDelete: Optional. If the highlight was marked for being not viewable by anyone but Admin. Default is false in backend.
//         //? The UI will have the following properites:
//             //* videoTitle and videoLink are required. They must be YouTube or Streamable links to be valid. Errors will be thrown if they are not.
//             //* When the videoLink is entered, it will give a preview of the video.
//             //* All other fields will be viewable via an Accordion.
//             //* The video will be posted to the database.
//             //* playersHighlighted can have a max of 5 players. It will fetch from https://www.balldontlie.io/#players.
//             //* gameDate will have a date picker that defaults to current date.
//             //* teamsFeatured can have a max of 2 teams. It will autosuggests teams from https://www.balldontlie.io/#teams
//             //* tags can have a max of 5 tags. It will autosuggest tags from the database.
//             //* nbaSeason will have a dropdown that defaults to current season. Format is always YYYY-YYYY.
//             //* clutch will have a radio button that defaults to false.
//             //* adminHighlighted and adminDelete will not be viewable or editable by a user without isAdmin=true state.

interface ABCprops {
	sessionToken: ABCtoken["sessionToken"];
	isAdmin: ABCuserInfo["isAdmin"];
	setVideoId: ABCvideo["setVideoId"];
	setVideoTitle: ABCvideo["setVideoTitle"];
	setVideoLink: ABCvideo["setVideoLink"];
	errorMessage: ABCcalls["errorMessage"];
	setErrorMessage: ABCcalls["setErrorMessage"];
	navigate: ABCcalls["navigate"];
}

// interface playersHighlightedProps {
//     label: string,
//     id: number,
//     playersHilghlighted: string[]
// }

// interface teamsFeaturedProps {
//     label: string,
//     number: number,
//     teamsFeatured: string[]
// }

// interface tags {
//     label: string,
//     id: number
// }

// interface nbaSeasonProps {
//     label: string,
//     id: number,
//     nbaSeason: string
// }

interface videoPostState {
	videoTitle: string;
	videoTitleError: string;
	isVideoTitleValid: boolean;
	videoLink: string;
	videoLinkError: string;
	isVideoLinkValid: boolean;
	// thumbnailImage?: string
	// playersHighlighted?: players[]
	// teamsFeatured: teams[]
	// tags: tags[]
	// gameDate: string
	// nbaSeason: string
	// isPlayoffs: boolean
	// clutch: boolean
	// adminHighlighted: boolean
	// adminDelete: boolean
	//? useNavigate declaration
}

class VideoPost extends React.Component<ABCprops, videoPostState> {
	constructor(props: ABCprops) {
		super(props);
		this.state = {
			videoTitle: "",
			videoTitleError: "",
			isVideoTitleValid: true,
			videoLink: "",
			videoLinkError: "",
			isVideoLinkValid: true,
			//             thumbnailImage: '',
			//             playersHighlighted: [''],
			//             teamsFeatured: [''],
			//             tags: [''],
			//             gameDate: new Date(),
			//             nbaSeason: '',
			//             isPlayoffs: false,
			//             clutch: false,
			//             adminHighlighted: false,
			//             adminDelete: false,
			//             isAdmin: false,
			//             players: [],
			//             teams: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		//         this.handlePlayersHighlighted = this.handlePlayersHighlighted.bind(this);
		//         this.handleTeamsFeatured = this.handleTeamsFeatured.bind(this);
		//         this.handleTags = this.handleTags.bind(this);
		//         this.handleGameDate = this.handleGameDate.bind(this);
		//         this.handleNbaSeason = this.handleNbaSeason.bind(this);
		//         this.handleIsPlayoffs = this.handleIsPlayoffs.bind(this);
		//         this.handleClutch = this.handleClutch.bind(this);

		//         this.handleAdminHighlighted = this.handleAdminHighlighted.bind(this);
		//         this.handleAdminDelete = this.handleAdminDelete.bind(this);
		this.verifyVideoLink = this.verifyVideoLink.bind(this);
		this.verifyVideoTitle = this.verifyVideoTitle.bind(this);
	}

	//! handleChange:
	handleChange(
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) {
		this.setState({
			...this.state,
			[event.target.name]: event.target.value,
		});
	}

	verifyVideoLink = (): boolean => {
		if (
			this.state.videoLink.includes("streamable") ||
			this.state.videoLink.includes("youtube") ||
			this.state.videoLink.includes("youtu.be") ||
			this.state.videoLink.includes("Streamable") ||
			this.state.videoLink.includes("YouTube") ||
			this.state.videoLink.includes("Youtube") ||
			this.state.videoLink.includes("Youtu.be")
		) {
			this.setState({
				videoLinkError: "",
				isVideoLinkValid: true,
			});
			return true;
		} else {
			this.setState({
				videoLinkError: "Please enter a valid video link.",
				isVideoLinkValid: false,
			});
			return false;
		}
	};

	verifyVideoTitle = (): boolean => {
		if (this.state.videoTitle.length > 0) {
			this.setState({
				videoTitleError: "",
				isVideoTitleValid: true,
			});
			return true;
		} else {
			this.setState({
				videoTitleError: "Please enter a valid video title.",
				isVideoTitleValid: false,
			});
			return false;
		}
	};

	//! handleSubmit:
	handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault();
		//! Check if this.verifyVideoLink() returns true, run the fetch
		this.verifyVideoLink();
		this.verifyVideoTitle();
		if (this.verifyVideoLink() === true && this.verifyVideoTitle() === true) {
			await fetch(`${dbCall}/videos/content/`, {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.props.sessionToken}`,
				}),
				body: JSON.stringify({
					videopost: {
						videoTitle: this.state.videoTitle,
						videoLink: this.state.videoLink,
						// thumbnailImage: this.state.thumbnailImage,
						// playersHighlighted: this.state.playersHighlighted,
						// teamsFeatured: this.state.teamsFeatured,
						// tags: this.state.tags,
						// gameDate: this.state.gameDate,
						// nbaSeason: this.state.nbaSeason,
						// isPlayoffs: this.state.isPlayoffs,
						// clutch: this.state.clutch,
						// adminHighlighted: this.state.adminHighlighted,
						// adminDelete: this.state.adminDelete,
					},
				}),
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					console.log(data);
					this.props.setVideoId(data.id);
					this.props.setVideoTitle(data.videoTitle);
					this.props.setVideoLink(data.videoLink);
					this.props.navigate("/");
				})
				.catch((err) => {
					console.log(err);
					this.props.setErrorMessage(err);
				});
		}
	};

	//! handlePlayersHighlighted:
	// handlePlayersHighlighted(event: any) {
	//     let playersHighlighted = this.state.playersHighlighted;
	//     playersHighlighted[event.target.name] = event.target.value;
	//     this.setState({
	//         playersHighlighted: playersHighlighted
	//     })
	// }

	//! handleTeamsFeatured:
	// handleTeamsFeatured(event: any) {
	//     let teamsFeatured = this.state.teamsFeatured;
	//     teamsFeatured[event.target.name] = event.target.value;
	//     this.setState({
	//         teamsFeatured: teamsFeatured
	//     })
	// }

	//! handleTags:
	// handleTags(event: any) {
	//     let tags = this.state.tags;
	//     tags[event.target.name] = event.target.value;
	//     this.setState({
	//         tags: tags
	//     })
	// }

	//? The videoTitle must contain either "streamable" or "youtube" or "youtu.be" in it or it will not be accepted.

	render(): React.ReactNode {
		return (
			<>
				<form
					onSubmit={this.handleSubmit}
					className="space-y-8 divide-y divide-gray-200 py-5 px-4 sm:px-6 lg:px-8"
				>
					<div className="space-y-8 divide-y divide-gray-200">
						<div>
							<div>
								<h3 className="text-lg leading-6 font-medium text-gray-900">
									Post Your Highlight
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Share your highlight with the world! Do note, only{" "}
									<a href="https://www.youtube.com/">YouTube</a> and{" "}
									<a href="https://streamable.com/">Streamable</a> links are
									accepted.
								</p>
							</div>
							<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
								<div className="sm:col-span-4">
									<label
										htmlFor="video-website"
										className="block text-sm font-medium text-gray-700"
									>
										Video
									</label>
									<div className="mt-1 flex rounded-md shadow-sm">
										<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
											Link
										</span>
										{/* if isVideoLinkValid is true */}
										{this.state.isVideoLinkValid === true ? (
											<input
												type="text"
												name="videoLink"
												id="videoLink"
												className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
												placeholder="www.streamable.com"
												onChange={this.handleChange}
												value={this.state.videoLink}
											/>
										) : (
											<>
												<input
													type="text"
													name="videoLink"
													id="videoLink"
													className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
													placeholder="www.streamable.com"
													onChange={this.handleChange}
													value={this.state.videoLink}
												/>
												<p className="mt-1 text-sm text-red-500">
													{this.state.videoLinkError}
												</p>
											</>
										)}
									</div>
								</div>

								<div className="sm:col-span-6">
									<label
										htmlFor="title-of-highlight"
										className="block text-sm font-medium text-gray-700"
									>
										Highlight Title
									</label>
									<div className="mt-1">
										{/* if isTitleValid is true */}
										{this.state.isVideoTitleValid === true ? (
											<textarea
												id="videoTitle"
												name="videoTitle"
												rows={1}
												onChange={this.handleChange}
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
												placeholder="Shaq dunks on Barkley."
												value={this.state.videoTitle}
											/>
										) : (
											<>
												<textarea
													id="videoTitle"
													name="videoTitle"
													rows={1}
													onChange={this.handleChange}
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
													placeholder="Please enter text here."
													value={this.state.videoTitle}
												/>
												<p className="mt-1 text-sm text-red-500">
													{this.state.videoTitleError}
												</p>
											</>
										)}
									</div>
									<p className="mt-2 text-sm text-gray-500">
										Brief title for your highlight. URLs are hyperlinked.
									</p>
								</div>

								<div className="">
									{/* Put button on the far right of the screen always. */}
									<div className="flex justify-start">
										<button
											type="submit"
											className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										>
											Submit
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</>
		);
	}
}

export default VideoPost;
