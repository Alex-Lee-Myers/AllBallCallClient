import React, { Fragment } from "react";
// import PropTypes from 'prop-types';
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { PlusSmIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ABCtoken, ABCuserInfo } from "../App";
import tempProfilePic from "../images/temp_prof_pic.jpg";

interface AuthProps {
	isAdmin: ABCuserInfo["isAdmin"];
	clearToken: ABCtoken["clearToken"];
	emailAddress: ABCuserInfo["emailAddress"];
	id: ABCuserInfo["id"];
	sessionToken: ABCtoken["sessionToken"];
	setSessionToken: ABCtoken["setSessionToken"];
	isUserLoggedIn: ABCtoken["isUserLoggedIn"];
	username: ABCuserInfo["username"];
}

interface userState {
	isAdmin: ABCuserInfo["isAdmin"];
	emailAddress: ABCuserInfo["emailAddress"] | null | string;
	id: ABCuserInfo["id"];
	imageUrl: string | undefined | "";
	isUserLoggedIn: ABCtoken["isUserLoggedIn"];
	username: ABCuserInfo["username"] | undefined | string;
	sessionToken: ABCtoken["sessionToken"];
}

interface navigationState {
	id: number;
	current: boolean;
	href: string;
	name: string;
	userVisible: boolean;
}

interface userNavigationState {
	id: number;
	href: string;
	pageName: string;
	userVisible: boolean;
}
//! Interface for:
// handles function classNames(...classes) {
//     return classes.filter(Boolean).join(" ");
//   }
interface navbarState {
	classNames: Function;
}

//TODO 0) Fix the navbar to be responsive to userLogin.
//* I believe I need to work out how to pass through AuthProps to the Navbar. Contstructor can't have props: any.

export default class Navbar extends React.Component<
	AuthProps,
	{
		user: userState;
		navigation: navigationState[];
		userNavigation: userNavigationState[];
		navBar: navbarState;
	}
> {
	constructor(props: any) {
		super(props);
		this.state = {
			user: {
				id: this.props.id,
				username: this.props.username,
				emailAddress: this.props.emailAddress,
				imageUrl: "",
				isAdmin: this.props.isAdmin,
				isUserLoggedIn: this.props.isUserLoggedIn,
				sessionToken: this.props.sessionToken,
			},
			navigation: [
				{
					id: 1,
					name: "Trending",
					href: "#",
					current: true,
					userVisible: false,
				},
				{
					id: 2,
					name: "Video Grid",
					href: "#",
					current: false,
					userVisible: false,
				},
				{
					id: 3,
					name: "Streamable",
					href: "#",
					current: false,
					userVisible: false,
				},
				{
					id: 4,
					name: "Admin Dashboard",
					href: "/adminDashboard",
					current: false,
					userVisible: false,
				},
			],
			userNavigation: [
				{
					id: 1,
					pageName: "Your Park",
					href: "#",
					userVisible: false,
				},
				{
					id: 2,
					pageName: "Settings",
					href: `/settings/`,
					userVisible: false,
				},
				{
					id: 3,
					pageName: "Logout",
					href: "/logout",
					userVisible: false,
				},
				{
					id: 4,
					pageName: "Login",
					href: "/login",
					userVisible: true,
				},
				{
					id: 5,
					pageName: "Sign Up",
					href: "/register",
					userVisible: true,
				},
			],
			navBar: {
				classNames: function (...classes: string[]) {
					return classes.filter(Boolean).join(" ");
				},
			},
		};
		this.handleUserVisibility = this.handleUserVisibility.bind(this);
	}

	// TODO Add conditionals function handleUserVisility() that will display certain links depending on the user's login status.
	//?  The conditionals will heavily use conditionals based on ABCtoken["isUserLoggedIn"] and ABCuserInfo["isAdmin"]
	//?  The conditionals will also use conditionals based on ABCuserInfo["username"] and ABCuserInfo["emailAddress"] and ABCuserInfo["imageUrl"]
	//?  The conditionals will also use conditionals based on ABCtoken["sessionToken"]
	//! There will be three different ways the Navbar will be rendered:
	//? 1) If the User is NOT logged in aka isUserLoggedIn=false and isAdmin=false, the Navbar will NOT render the following:
	//* 1.1) Streamable
	//* 1.2) Admin Dashboard
	//* 1.3) Post Highlight
	//* 1.4) Settings
	//* 1.5) Your Park
	//? 2) If a User is logged in aka isUserLoggedIn=true and isAdmin=false, the Navbar will NOT render the following and set these states to userVisible=false:
	//* 2.1) Admin Dashboard
	//* 2.2) Register
	//* 2.3) Login
	//? 3) If an Admin is logged in aka isUserLoggedIn=true and isAdmin=true, the Navbar will NOT render the following and set these states to userVisible=false:
	//* 3.1) Register
	//* 3.2) Login

	handleUserVisibility() {
		//! GUEST NAV
		if (this.props.isUserLoggedIn === false) {
			this.setState({
				user: {
					id: this.props.id,
					username: this.props.username,
					emailAddress: this.props.emailAddress,
					imageUrl: tempProfilePic,
					isAdmin: this.props.isAdmin,
					isUserLoggedIn: this.props.isUserLoggedIn,
					sessionToken: this.props.sessionToken,
				},
				navigation: [
					{
						id: 1,
						name: "Trending",
						href: "/",
						current: true,
						userVisible: false,
					},
					{
						id: 2,
						name: "Your Park",
						href: "#",
						current: false,
						userVisible: false,
					},
					{
						id: 3,
						name: "Streamable",
						href: "#",
						current: false,
						userVisible: false,
					},
					{
						id: 4,
						name: "Admin Dashboard",
						href: "/admindashboard",
						current: false,
						userVisible: false,
					},
				],
				userNavigation: [
					{
						id: 1,
						pageName: "Your Park",
						href: "#",
						userVisible: false,
					},
					{
						id: 2,
						pageName: "Settings",
						href: `/settings/`,
						userVisible: false,
					},
					{
						id: 3,
						pageName: "Logout",
						href: "/logout",
						userVisible: false,
					},
					{
						id: 4,
						pageName: "Login",
						href: "/login",
						userVisible: true,
					},
					{
						id: 5,
						pageName: "Sign Up",
						href: "/register",
						userVisible: true,
					},
				],
			});
		}
		//! USER NAV
		if (this.props.isUserLoggedIn === true && this.props.isAdmin === false) {
			this.setState({
				user: {
					id: this.props.id,
					username: this.props.username,
					emailAddress: this.props.emailAddress,
					imageUrl: tempProfilePic,
					isAdmin: this.props.isAdmin,
					isUserLoggedIn: this.props.isUserLoggedIn,
					sessionToken: this.props.sessionToken,
				},
				navigation: [
					{
						id: 1,
						name: "Trending",
						href: "/",
						current: true,
						userVisible: true,
					},
					{
						id: 2,
						name: "My Park",
						href: "/mypark",
						current: false,
						userVisible: true,
					},
					{
						id: 3,
						name: "Streamable",
						href: "#",
						current: false,
						userVisible: false,
					},
					{
						id: 4,
						name: "Admin Dashboard",
						href: "/admindashboard",
						current: false,
						userVisible: false,
					},
				],
				userNavigation: [
					{
						id: 1,
						pageName: "My Park",
						href: "/mypark",
						userVisible: true,
					},
					{
						id: 2,
						pageName: "Settings",
						href: `/settings/`,
						userVisible: true,
					},
					{
						id: 3,
						pageName: "Logout",
						href: "/logout",
						userVisible: true,
					},
					{
						id: 4,
						pageName: "Login",
						href: "/login",
						userVisible: false,
					},
					{
						id: 5,
						pageName: "Sign Up",
						href: "/register",
						userVisible: false,
					},
				],
			});
		}
		//! ADMIN NAV
		if (this.props.isUserLoggedIn === true && this.props.isAdmin === true) {
			this.setState({
				user: {
					id: this.props.id,
					username: this.props.username,
					emailAddress: this.props.emailAddress,
					imageUrl: tempProfilePic,
					isAdmin: this.props.isAdmin,
					isUserLoggedIn: this.props.isUserLoggedIn,
					sessionToken: this.props.sessionToken,
				},
				navigation: [
					{
						id: 1,
						name: "Trending",
						href: "/",
						current: true,
						userVisible: true,
					},
					{
						id: 2,
						name: "My Park",
						href: "/mypark",
						current: false,
						userVisible: true,
					},
					{
						id: 3,
						name: "Streamable",
						href: "#",
						current: false,
						userVisible: false,
					},
					{
						id: 4,
						name: "Admin Dashboard",
						href: "/admindashboard",
						current: false,
						userVisible: true,
					},
				],
				userNavigation: [
					{
						id: 1,
						pageName: "My Park",
						href: "/mypark",
						userVisible: true,
					},
					{
						id: 2,
						pageName: "Settings",
						href: `/settings/`,
						userVisible: true,
					},
					{
						id: 3,
						pageName: "Logout",
						href: "/logout",
						userVisible: true,
					},
					{
						id: 4,
						pageName: "Login",
						href: "/login",
						userVisible: false,
					},
					{
						id: 5,
						pageName: "Sign Up",
						href: "/register",
						userVisible: false,
					},
				],
			});
		}
	}

	//! The Navbar component should re-render whenever the ABCuserInfo.id changes. This is because the user's id changes when they log in. The function handleUserVisibility() is called whenever the ABCuserInfo.id changes.
	//* handleUserVisibility() is called in the constructor() and in the componentDidUpdate() function.
	//* componentDidUpdate will compare the ABCuserInfo.id to the ABCuserInfo.id in the previous state. If they are different, then the handleUserVisibility() function will be called.

	componentDidMount() {
		this.handleUserVisibility();
	}

	componentDidUpdate(prevProps: Readonly<AuthProps>) {
		if (prevProps.id !== this.state.user.id) {
			console.log("User id changed");
			this.handleUserVisibility();
		} else if (prevProps.isUserLoggedIn !== this.state.user.isUserLoggedIn) {
			console.log("User logged in changed");
			this.handleUserVisibility();
		} else if (prevProps.isAdmin !== this.state.user.isAdmin) {
			console.log("User admin status changed");
			this.handleUserVisibility();
		} else if (prevProps.sessionToken !== this.state.user.sessionToken) {
			console.log("User session token changed");
			this.handleUserVisibility();
		} else if (prevProps.emailAddress !== this.state.user.emailAddress) {
			console.log("User email address changed");
			this.handleUserVisibility();
		} else if (prevProps.username !== this.state.user.username) {
			console.log("User username changed");
			this.handleUserVisibility();
		}
	}

	render() {
		return (
			<Disclosure as="nav" className="bg-gray-800 z-100">
				{({ open }) => (
					<div className="z-50">
						<div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between h-16">
								<div className="flex">
									<div className="-ml-2 mr-2 flex items-center md:hidden">
										{/*//! Mobile menu button */}
										<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<XIcon className="block h-6 w-6" aria-hidden="true" />
											) : (
												<MenuIcon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											)}
										</Disclosure.Button>
									</div>
									<div className="flex-shrink-0 flex items-center">
										<Link to="/">
											<img
												className="block lg:hidden h-8 w-auto"
												src="https://raw.githubusercontent.com/Alex-Lee-Myers/AllBallCallClient/e0ca73fe63253d3f3fd953d992d4dbecb1a69874/src/assets/allballcall-500.svg"
												alt="AllBallCall"
											/>
										</Link>
										<Link to="/">
											<img
												className="hidden lg:block h-8 w-auto"
												src="https://raw.githubusercontent.com/Alex-Lee-Myers/AllBallCallClient/e0ca73fe63253d3f3fd953d992d4dbecb1a69874/src/assets/allballcall-logo-500-white-text.svg"
												alt="AllBallCall"
											/>
										</Link>
									</div>
									<div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
										{/* 
                                        Do not show items in the navigation bar set to userVisible is false
                                        */}
										{this.state.navigation.map((item, index) => {
											if (item.userVisible === true) {
												return (
													<Link
														key={index}
														to={item.href}
														className={
															item.current
																? "block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
																: "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
														}
													>
														{item.name}
													</Link>
												);
											}
										})}
									</div>
								</div>
								<div className="flex items-center">
									{this.state.user.isUserLoggedIn ? (
										<div className="flex-shrink-0">
											<Link to="/videos/content">
												{" "}
												{/* Change to videoPost when added*/}
												<button
													type="button"
													className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
												>
													<PlusSmIcon
														className="-ml-1 mr-2 h-5 w-5"
														aria-hidden="true"
													/>
													<span>Post Highlight</span>
												</button>
											</Link>
										</div>
									) : null}
									<div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
										{this.state.user.isUserLoggedIn ? (
											<button
												type="button"
												className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
											>
												<span className="sr-only">View notifications</span>
												<BellIcon className="h-6 w-6" aria-hidden="true" />
											</button>
										) : null}

										{/*//! Profile dropdown */}
										<Menu as="div" className="ml-3 relative">
											<div>
												<Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
													<span className="sr-only">Open user menu</span>
													<img
														className="h-8 w-8 rounded-full"
														src={tempProfilePic} //! Change to this.state.user.imageUrl when added
														alt={this.state.user.username}
													/>
												</Menu.Button>
											</div>
											{/* A dropdown list from Headless UI based in React with Typescript. It will show userNavigation items. If the user is  */}
											<Transition
												// as = the ability to open a dropdown list in lines 191-192
												as={Fragment}
												enter="transition ease-out duration-200"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
											>
												<Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
													{this.props.isUserLoggedIn ? (
														<div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
															{this.props.username} |{" "}
															{this.props.emailAddress}
														</div>
													) : null}
													{this.props.isUserLoggedIn ? (
														<div className="block px-4 py-2 text-sm bg-indigo-200"></div>
													) : null}
													{this.state.userNavigation.map((item) => {
														if (item.userVisible) {
															return (
																<Link
																	key={item.id}
																	to={item.href}
																	className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
																>
																	{item.pageName}
																</Link>
															);
														}
													})}
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>
							</div>
						</div>

						<Disclosure.Panel className="md:hidden">
							<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
								{this.state.navigation.map((navigation: navigationState) => (
									<Disclosure.Button
										key={navigation.name}
										as="a"
										href={navigation.href}
										className={this.state.navBar.classNames(
											navigation.current
												? "bg-gray-900 text-white"
												: "text-gray-300 hover:bg-gray-700 hover:text-white",
											"block px-3 py-2 rounded-md text-base font-medium"
										)}
										aria-current={navigation.current ? "page" : undefined}
									>
										{navigation.name}
									</Disclosure.Button>
								))}
							</div>
							<div className="pt-4 pb-3 border-t border-gray-700">
								<div className="flex items-center px-5 sm:px-6">
									<div className="flex-shrink-0">
										<img
											className="h-10 w-10 rounded-full"
											src={tempProfilePic} //? Need to change to this.state.user.imageUrl when added
											alt={this.state.user.username}
										/>
									</div>
									<div className="ml-3">
										<div className="text-base font-medium text-white">
											{this.state.user.username}
										</div>
										<div className="text-sm font-medium text-gray-400">
											{this.state.user.emailAddress}
										</div>
									</div>
									<button
										type="button"
										className="ml-auto flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
									>
										<span className="sr-only">View notifications</span>
										<BellIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>
								<div className="mt-3 px-2 space-y-1 sm:px-3">
									{this.state.userNavigation.map(
										(userNavigation: userNavigationState) => (
											<Disclosure.Button
												key={userNavigation.pageName}
												as="a"
												href={userNavigation.href}
												className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
											>
												{userNavigation.pageName}
											</Disclosure.Button>
										)
									)}
								</div>
							</div>
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
		);
	}
}
