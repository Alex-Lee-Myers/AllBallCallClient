import React, { Fragment, useState } from 'react'
import { Disclosure, Menu, RadioGroup, Transition } from '@headlessui/react'
import { HomeIcon, PlusIcon, SearchIcon } from '@heroicons/react/solid'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import ReactPlayer from 'react-player';
import { ABCtoken, ABCuserInfo } from '../App';
import dbCall from '../helpers/Environments';

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


interface userProps {
    sessionToken: ABCtoken['sessionToken']
    isAdmin: ABCuserInfo['isAdmin']
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
    videoTitle: string
    videoLink: string
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
}

class VideoPost extends React.Component<userProps, videoPostState> {
        constructor(props: userProps) {
            super(props);
            this.state = {
                videoTitle: '',
                videoLink: '',
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
            }

            this.handleChange = this.handleChange.bind(this);

    //         this.handlePlayersHighlighted = this.handlePlayersHighlighted.bind(this);
    //         this.handleTeamsFeatured = this.handleTeamsFeatured.bind(this);
    //         this.handleTags = this.handleTags.bind(this);
    //         this.handleGameDate = this.handleGameDate.bind(this);
    //         this.handleNbaSeason = this.handleNbaSeason.bind(this);
    //         this.handleIsPlayoffs = this.handleIsPlayoffs.bind(this);
    //         this.handleClutch = this.handleClutch.bind(this);

    //         this.handleAdminHighlighted = this.handleAdminHighlighted.bind(this);
    //         this.handleAdminDelete = this.handleAdminDelete.bind(this);
        }

    //! handleChange:
    handleChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }

    //! handleSubmit:
    handleSubmit = async (event: React.FormEvent<HTMLFormElement>):Promise<void> => {
        event.preventDefault();
        console.log(this.state);
        fetch(`${dbCall}/videos/content/`, {
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
          .then((res) => {
            console.log(res);
            this.setState({
              videoTitle: "",
              videoLink: "",
              // thumbnailImage: '',
              // playersHighlighted: [''],
              // teamsFeatured: [''],
              // tags: [''],
              // gameDate: new Date(),
              // nbaSeason: '',
              // isPlayoffs: false,
              // clutch: false,
              // adminHighlighted: false,
              // adminDelete: false,
            });
          })
          .catch((err) => {
            console.log("VideoPostSubmit: ", err);
          });
                }

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

    //! handleGameDate:
    // handleGameDate(event: any) {
    //     this.setState({
    //         gameDate: event.target.value
    //     })
    // }

    //! handleNbaSeason:
    // handleNbaSeason(event: any) {
    //     this.setState({
    //         nbaSeason: event.target.value
    //     })
    // }

    //! handleIsPlayoffs:   //? What does this function do? 
    // handleIsPlayoffs(event: any) {
    //     this.setState({
    //         isPlayoffs: event.target.value
    //     })
    // }

    //! handleClutch:
    // handleClutch(event: any) {
    //     this.setState({
    //         clutch: event.target.value
    //     })
    // }

    //! handleAdminHighlighted:
    // handleAdminHighlighted(event: any) {
    //     this.setState({
    //         adminHighlighted: event.target.value
    //     })
    // }

    //! handleAdminDelete:
    // handleAdminDelete(event: any) {
    //     this.setState({
    //         adminDelete: event.target.value
    //     })
    // }

    //! handleThumbnailImage:
    // handleThumbnailImage(event: any) {
    //     this.setState({
    //         thumbnailImage: event.target.value
    //     })
    // }

    //! handleVideoLink:
    // handleVideoLink(event: any) {
    //     this.setState({
    //         videoLink: event.target.value
    //     })
    // }

    //! handleVideoTitle:
    // handleVideoTitle(event: any) {
    //     this.setState({
    //         videoTitle: event.target.value
    //     })
    // }

    render(): React.ReactNode {
        return (
            <>
                <div>
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <div className="px-4 sm:px-0">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Post Your Highlight</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Share your highlight with the world! Do note, only <a href="https://www.youtube.com/">YouTube</a> and <a href="https://streamable.com/">Streamable</a> links are accepted.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form onSubmit={this.handleSubmit}>
                                <div className="shadow sm:rounded-md sm:overflow-hidden">
                                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="col-span-3 sm:col-span-2">
                                                <label htmlFor="video-website" className="block text-sm font-medium text-gray-700">
                                                    Website
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        http://
                                                    </span>
                                                    <input
                                                        type="text"
                                                        name="video-website"
                                                        id="video-website"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        placeholder="www.streamable.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                                About
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="about"
                                                    name="about"
                                                    rows={3}
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                    placeholder="you@example.com"
                                                    defaultValue={''}
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Brief description for your profile. URLs are hyperlinked.
                                            </p>
                                        </div>

                                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Save
                                            </button>
                                        </div>
                                        </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default VideoPost;
