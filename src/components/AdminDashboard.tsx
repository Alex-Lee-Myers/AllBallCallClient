import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ABCcalls, ABCvideo, ABCtoken, ABCuserInfo } from '../App';

interface AdminProps {
    //? Video Props
    setVideoId: ABCvideo['setVideoId'];
    setVideoTitle: ABCvideo['setVideoTitle'];
    setVideoLink: ABCvideo['setVideoLink'];
    setVideoOwner: ABCvideo['setVideoOwner'];
    setVideoOwnerUsername: ABCvideo['setVideoOwnerUsername'];
    //? ABCcalls
    errorMessage: ABCcalls["errorMessage"];
    setErrorMessage: ABCcalls["setErrorMessage"];
    responseStatus: ABCcalls["responseStatus"];
    setResponseStatus: ABCcalls["setResponseStatus"];
    //? userInfo
    isUserLoggedIn: ABCtoken["isUserLoggedIn"];
    sessionToken: ABCtoken["sessionToken"];
    isAdmin: ABCuserInfo["isAdmin"];
}

export default class AdminDashboard extends Component<AdminProps> {


	// componentWillMount() {

	// }

	// componentDidMount() {

	// }

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
		return <div></div>;
	}
}