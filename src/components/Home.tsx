import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ABCcalls, ABCvideo, ABCuserInfo, ABCtoken } from '../App';
import dbCall from "../helpers/Environments";

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
	videoId: ABCvideo['videoId'];
	videoTitle: string;
	videoLink: string;
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

						<div className="space-y-2 ">
							<div className="text-lg -mt-4 pb-5 leading-6 font-medium space-y-1">
								<h3>{videos.videoTitle}</h3>
								<p className="text-indigo-600">
									{videos.videoOwnerUsername}
								</p>
							</div>
						</div>
					</div>
				</li>
			);
		})
	};


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
												{/* <ul role="list" className="flex space-x-5">
                            <li>
                            <a href={video.team} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">{Team Name}</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path team picture here" /> }
                                </svg>
                            </a>
                            </li>
                            <li>
                            could put a second logo here of something for category or list out names
                            </li>
							</ul> */
							}
						</ul>
					</div>
				</div>
				</div>
		);
		}
	}
			

