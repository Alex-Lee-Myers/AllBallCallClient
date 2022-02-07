//import interfaces from App.tsx
import { ABCtoken, ABCuserInfo, ABCcalls } from "../App";
import dbCall from '../helpers/Environments';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
// import loginSplash.jpg and allballcall-500.svg from src/images
import loginSplash from '../images/loginSplash.jpg';
import allballcall_500 from '../images/allballcall-logo-500-black-text.svg';

export interface AuthProps {
    id: ABCuserInfo["id"];
    setId: ABCuserInfo["setId"];
    isAdmin: ABCuserInfo["isAdmin"];
    setIsAdmin: ABCuserInfo["setIsAdmin"];
    emailAddress: ABCuserInfo["emailAddress"];
    setEmailAddress: ABCuserInfo["setEmailAddress"];
    errorMessage: ABCcalls["errorMessage"];
    setErrorMessage: ABCcalls["setErrorMessage"];
    responseStatus: ABCcalls["responseStatus"];
    setResponseStatus: ABCcalls["setResponseStatus"];
    sessionToken: ABCtoken["sessionToken"];
    setSessionToken: ABCtoken["setSessionToken"];
    updateToken: ABCtoken["updateToken"];
    isUserLoggedIn: ABCtoken["isUserLoggedIn"];
    setIsUserLoggedIn: ABCtoken["setIsUserLoggedIn"];
    username: ABCuserInfo["username"];
    setUsername: ABCuserInfo["setUsername"];
};

//TODO 0) Test endpoint.
//TODO 1) Add verification prompts surrounding the fields.
//TODO 2) Add a password reset feature.
//TODO 3) Add a forgot password feature.
//TODO 4) Add margin between register prompt and login form.

//! Function version
const Login = (props: AuthProps) => {
    const navigate = useNavigate();
    const [passwordhash, setPasswordhash] = React.useState<string>("");
    const [loginUsernameOrEmail, setLoginUsernameOrEmail] = React.useState<string>("");
    
    const loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.id === "passwordhash") {
            setPasswordhash(event.target.value);
        } else if (event.target.id === "username-or-email") {
            setLoginUsernameOrEmail(event.target.value);
        } else {
            console.log("Login.tsx: loginChange(): unknown event target id: " + event.target.id);
        }
    }

    const loginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // postgresql database call
        await fetch(`${dbCall}/users/login`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ user: {
                username: loginUsernameOrEmail,
                email: loginUsernameOrEmail,
                passwordhash: passwordhash
            }})
        })
        .then (response => response.json())
        .then (data => {
            if (data.status === 200 && (data.isAdmin === false || data.isAdmin === null)) {
                console.log("Successfully logged-in!");
                console.log("Login data: ", data);
                props.setSessionToken(data.sessionToken);
                props.updateToken(data.sessionToken);
                props.setErrorMessage('');
                props.setIsUserLoggedIn(true);
                props.setId(data.id);
                props.setIsAdmin(data.isAdmin);
                props.setUsername(data.username);
                props.setEmailAddress(data.email);
                navigate('/');
            } else if (data.status === 200 && data.isAdmin === true) {
                console.log("Admin | Successfully logged-in!");
                console.log("Admin | Login data: ", data);
                props.setSessionToken(data.sessionToken);
                props.updateToken(data.sessionToken);
                props.setErrorMessage('');
                props.setIsUserLoggedIn(true);
                props.setId(data.id);
                props.setIsAdmin(data.isAdmin);
                props.setUsername(data.username);
                props.setEmailAddress(data.emailAddress);
                navigate("/register"); //TODO: change to admin page
            }
            else {
                props.setErrorMessage(data.errorMessage);
            }
        })
    }

    return (
        <div className="min-h-full flex">
            <div className="h-screen flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <img
                            className="h-12 w-auto"
                            src={allballcall_500}
                            alt="AllBallCall"
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-right">Sign in to your account.</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            or{' '}
                            {/* register */}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 ">Register to call your own shots.</Link>
                        </p>
                    </div>

            <form className="space-y-6" onSubmit={loginSubmit}>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-5 text-gray-700">
                        Username or Email Address
                    </label>
                    <div className="mt-1">
                        <input
                            //  user can type in username or email address
                            id="username-or-email"
                            name="username-or-email"
                            type="text"
                            value={loginUsernameOrEmail}
                            onChange={loginChange}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            

            <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                    id="passwordhash"
                    name="passwordhash"
                    type="password"
                    value={passwordhash}
                    autoComplete="current-password"
                    onChange={loginChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
            <img
                className="absolute inset-0 h-screen w-full object-cover"
                // import loginSplash.jpg
                src={loginSplash}
                alt=""
            />
        </div>
    </div>
    );
}

export default Login;
//! Navbar Top Links
//{this.state.navigation.map(
// 	(navigation: navigationProps) => (
// 		<a
// 			key={navigation.id}
//             href={navigation.href}
            
// 			className={this.state.navBar.classNames(
// 				navigation.current
// 					? "bg-gray-900 text-white"
// 					: "text-gray-300 hover:bg-gray-700 hover:text-white",
// 				"px-3 py-2 rounded-md text-sm font-medium"
// 			)}
// 			aria-current={navigation.current ? "page" : undefined}
// 		>
// 			{navigation.name}
// 		</a>
// 	)
// )}

//! Navbar Profile Links
//{this.state.userNavigation.map(
// 	(userNavigation: userNavigationProps) => (
// 		<Menu.Item key={userNavigation.pageName}>
// 			<a
// 				href={userNavigation.href}
// 				className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// 			>
// 				{userNavigation.pageName}
// 			</a>
// 		</Menu.Item>
// 	)
// )}