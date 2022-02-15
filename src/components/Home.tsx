import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ABCcalls, ABCvideo, ABCtoken } from '../App';
import dbCall from "../helpers/Environments";
import { BrowserRouter as  Route,  Link } from "react-router-dom";

interface videoState {
	videoId: string;
	videoTitle: string;
	videoLink: string;
	videoOwner: string;
	videoOwnerId: string;
	videoOwnerUsername: string;
	videoPostsArray: string[];
}

interface videoProps {
    //? Video Props
	setVideoId: ABCvideo['setVideoId'];
	setVideoTitle: ABCvideo['setVideoTitle'];
	setVideoLink: ABCvideo['setVideoLink'];
    //? ABCcalls
    errorMessage: ABCcalls["errorMessage"];
    setErrorMessage: ABCcalls["setErrorMessage"];
    responseStatus: ABCcalls["responseStatus"];
    setResponseStatus: ABCcalls["setResponseStatus"];
    //? userInfo
    isUserLoggedIn: ABCtoken["isUserLoggedIn"];
    sessionToken: ABCtoken["sessionToken"];

    //? Future Updates
	// thumbnailImage: string;
	// playersHighlighted: playersHighlightedArray[];
	// teamsFeatured: teamsFeaturedArray[];
	// tags: tagsArray[];
	// gameDate: Date;
	// nbaSeason: string;
	// isPlayoffs: boolean;
	// clutch: boolean;
	// adminHighlighted: boolean;
	// adminDelete: boolean;
}

// type playersHighlightedArray = {
//     id: number;
//     playerName: string;
// }

// type teamsFeaturedArray = {
//     id: number;
//     teamName: string;
// };

// type tagsArray = {
//     id: number;
//     tagName: string;
// };

export default class Home extends Component<
	videoProps,
	videoState
> {
	constructor(props: videoProps) {
		super(props);
		this.state = {
			videoId: "",
			videoTitle: "",
			videoLink: "",
			videoOwner: "",
			videoOwnerId: "",
			videoOwnerUsername: "",
			videoPostsArray: [],
		};
		this.fetchVideos = this.fetchVideos.bind(this);
		// this.videoPostArrayRender = this.videoPostArrayRender.bind(this);
	}

	componentDidMount() {
		this.fetchVideos();
	}

	//! returns [] of videos with following properties:
	//? videoID, videoTitle, videoLink.
	//! sort by newest first.
	fetchVideos = async () => {
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

	//! returns [] of videos with following properties:
	//? videoID, videoTitle, videoLink.
	//! sort by newest first.
	videoPostArrayRender = () => {
		return this.state.videoPostsArray?.map((videos: any, index: number) => {
			return (
				<li key={videos.videoID} className="pb-5 ">
					<div className=" space-y-2 space-x-2 shadow-lg rounded-lg  bg-red-400 ">
						<div className="">
							<ReactPlayer
								width={"100%"}
								url={videos.videoLink}
								id="react-player"
								className="rounded-lg "
							/>
						</div>

						<div className="space-y-20">
							<div className="text-lg -mt-2 pb-5 leading-6 font-medium space-y-1">
								<h3>{videos.videoTitle}</h3>
								<div className="flex justify-between px-2">
									<p className="text-indigo-600">
										{/* LINK TO: Added to later. Goes to User's account information (all posts and comments.) If they're owner of the account, they can edit/delete everything on this page. If not, they can only view. */}
										{videos.user.username}
									</p>
									<div className="mr-4">
										{/* onClick event that <Link to={`/videos/${videos.videoID}`}> and then this.props.setVideoId{videos.videoID} + this.props.setVideoTitle{videos.videoTitle} + this.props.setVideoLink */}
										<Link
											to={`/videos/${videos.videoID}`}
											onClick={() => {
												this.props.setVideoId(videos.videoID);
												this.props.setVideoTitle(videos.videoTitle);
												this.props.setVideoLink(videos.videoLink);
											}}
										>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
													<path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
												</svg>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			);
		})
	};

// setState of videoId onClick of video in lined 140.
	render(): React.ReactNode {
		return (
			<div className="bg-white">
				<div className="mx-auto py-4 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-16">
					<div className="space-y-8">
						<div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
							<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
								Trending
							</h2>
							<p className="text-xl text-gray-500">Ball don't lie.</p>
						</div>
						{/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
						<ul
							role="list"
							className="-mt-7 scroll-px-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
						>
							{this.videoPostArrayRender()}
						</ul>
					</div>
				</div>
			</div>
		);
		}
	}
			

