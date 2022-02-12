import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ABCcalls, ABCvideo, ABCuserInfo, ABCtoken } from '../App';
import dbCall from "../helpers/Environments";

interface highlightedVideosProps {
    id: number;
    name: string;
    playerHighlighted: string;
    href: string;
    tag: string;
    src: string;
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

type videoProperties = {
    id: string;
    videoTitle: string;
    videoLink: string;
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
	{ highlightedVideos: highlightedVideosProps[] }
> {
	constructor(props: videoProps) {
		super(props);
		this.state = {
			highlightedVideos: [
				{
					id: 1,
					name: "Shaq and Embiid",
					playerHighlighted: "Talk Show",
					href: "https://streamable.com/pfamf9",
					tag: "NBA",
					src: "https://streamable.com/pfamf9",
				},
				{
					id: 2,
					name: "Sdd",
					playerHighlighted: "Talk Show",
					href: "https://streamable.com/pfamf9",
					tag: "NBA",
					src: "https://streamable.com/pfamf9",
				},
				{
					id: 3,
					name: "Sdd",
					playerHighlighted: "Talk Show",
					href: "https://streamable.com/pfamf9",
					tag: "NBA",
					src: "https://streamable.com/pfamf9",
				},
				{
					id: 4,
					name: "Sdd",
					playerHighlighted: "Talk Show",
					href: "https://streamable.com/pfamf9",
					tag: "NBA",
					src: "https://streamable.com/pfamf9",
				},
				{
					id: 5,
					name: "Sdd",
					playerHighlighted: "Talk Show",
					href: "https://streamable.com/pfamf9",
					tag: "NBA",
					src: "https://streamable.com/pfamf9",
				},
				{
					id: 6,
					name: "Sdd",
					playerHighlighted: "Talk Show",
					href: "https://streamable.com/pfamf9",
					tag: "NBA",
					src: "https://streamable.com/pfamf9",
				},
				// More videos...
            ],
            
        }
        this.fetchVideos = this.fetchVideos.bind(this);
	}

	//! fetching all videos, regardless of validation.
	//! sort by newest first.
	fetchVideos = async () => {
		const response = await fetch(`${dbCall}/videos/content/all`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		this.props.setResponseStatus(response.status);
		this.props.setErrorMessage(data.errorMessage);
	};

	componentDidMount() {
		this.fetchVideos();
	}

	render() {
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
							{this.state.highlightedVideos.map(
								(video: highlightedVideosProps) => (
									<li key={video.id} className="pb-5 ">
										<div className=" space-y-2 space-x-2 shadow-lg rounded-lg  bg-red-400 ">
											<div className="">
												<ReactPlayer
													width={"100%"}
													url={video.src}
													id="react-player"
													className="rounded-lg "
												/>
											</div>

											<div className="space-y-2 ">
												<div className="text-lg -mt-4 pb-5 leading-6 font-medium space-y-1">
													<h3>{video.name}</h3>
													<p className="text-indigo-600">
														{video.playerHighlighted}
													</p>
												</div>
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
                        </ul> */}
											</div>
										</div>
									</li>
								)
							)}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

