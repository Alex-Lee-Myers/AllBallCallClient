import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ABCcalls, ABCvideo, ABCuserInfo, ABCtoken } from '../App';
import { Fragment } from "react";
import { StarIcon } from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";
import { BrowserRouter as Route, Link } from "react-router-dom";
import dbCall from "../helpers/Environments";
import tempProfilePic from "../images/temp_prof_pic.jpg";

interface videoProps {
    videoId: ABCvideo['videoId'];
    videoTitle: ABCvideo['videoTitle'];
    videoLink: ABCvideo['videoLink'];
    username: ABCuserInfo['username'];
    id: ABCuserInfo['id'];
    isAdmin: ABCuserInfo['isAdmin'];
	isUserLoggedIn: ABCtoken['isUserLoggedIn'];
	sessionToken: ABCtoken['sessionToken'];
}

interface videoState {
	videoId: string;
	videoTitle: string;
	videoLink: string;
	videoOwner: string;
	videoOwnerId: string;
	videoOwnerUsername: string;
	videoPostsArray: string[];
	commentsArray: string[];
}

interface renderClassNames {
	classNames: Function;
}

export default class Video extends Component<
    videoProps,
    {
    videoState: videoState;
    renderClassNames: renderClassNames;
    }
> {
    constructor(props: videoProps) {
        super(props);
        this.state = {
            videoState: {
                videoId: this.props.videoId,
                videoTitle: this.props.videoTitle,
                videoLink: this.props.videoLink,
                videoOwner: '',
                videoOwnerId: '',
                videoOwnerUsername: '',
				videoPostsArray: [],
				commentsArray: [],
            },
            renderClassNames: {
				classNames: function (...classes: string[]) {
					return classes.filter(Boolean).join(" ");
				},
			}
		}
		this.fetchCommentsArray = this.fetchCommentsArray.bind(this);
	}
	
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
					videoState: {
						...this.state.videoState,
						commentsArray: responseJson.allComments,
					},
				});
				console.log("Comments Array:", this.state.videoState.commentsArray);
			})
			.catch((error) => {
				console.log(error);
			});
	}



    // componentWillMount() {

    // }

    componentDidMount() {
		this.fetchCommentsArray();
		console.log(`${dbCall}/comments/${this.props.videoId}`);
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
											url={this.state.videoState.videoLink} //{videos.videoLink}
											alt={this.state.videoState.videoTitle} //{videos.videoTitle}
											className="object-center object-cover shadow-2xl"
										/>
									</div>
								</div>

								{/* Video details */}
								<div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
									<div className="flex flex-col-reverse">
										<div className="mt-4">
											<h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
												{this.state.videoState.videoTitle}
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
												{/* {this.state.videoState.likes} vs {this.state.videoState.dislikes}*/}
											</p>
										</div>
									</div>

									<p className="text-gray-500 mt-6">
										{/* {videos.description}*/}
									</p>

									<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
										<button
											type="button"
											className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
										>
											Comment {/* {comment button} */}
										</button>
										<button
											type="button"
											className="w-full bg-indigo-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
										>
											
											Chexx {/* {this.state.videoState.videoOwner} */}
										</button>
									</div>

									<div className="border-t border-gray-200 mt-10 pt-10">
										<h3 className="text-sm font-medium text-gray-900">
											Players
										</h3>
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

						
						{/* Tab List that shows comments from {this.state.videoState.commentsArray} which are 
							1) mapped out listing commentsArray.commentText, 
							2) indexed by commentsArray.commentsID, 
							3) sorted by commentsArray.createdAt, 
							4) showing the commentsArray.user.username. */}
						<ul className="mt-4">
							{this.state.videoState.commentsArray?.map((comment: any) => {
								return (
									<li key={comment.commentsID}>
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
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		);
    }
}