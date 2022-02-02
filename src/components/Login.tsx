//import interfaces from App.tsx
import { ABCtoken} from '../App'
import dbCall from '../helpers/Environments';
import { useNavigate, Link } from 'react-router-dom';
import React, { Component } from 'react';
// import loginSplash.jpg and allballcall-500.svg from src/images
import loginSplash from '../images/loginSplash.jpg';
import allballcall_500 from '../images/allballcall-logo-500-black-text.svg';

type LoginState = {
    id: string;
    isAdmin: boolean;
    emailAddress: string,
    errorMessage: string,
    // loginDb: () => Promise<void>;
    // loginChange (event: React.ChangeEvent<HTMLInputElement>): void;
    // loginSubmit (event: React.FormEvent<HTMLFormElement>): void;
    // mountyPython: boolean,
    // isUserLoggedIn: boolean,
    // passwordhash: string,
    responseStatus: number,
    sessionToken: ABCtoken['sessionToken'],
    setSessionToken: ABCtoken['setSessionToken'],
    updateToken: ABCtoken['updateToken'],
    username: string,
    }
//TODO 0) Test endpoint.
//TODO 1) Add verification prompts surrounding the fields.
//TODO 2) Add a password reset feature.
//TODO 3) Add a forgot password feature.
//TODO 4) Add margin between register prompt and login form.

//! Function version
const Login = (props: LoginState) => {
    const navigate = useNavigate();
    const [emailAddress, setEmailAddress] = React.useState<string>('');
    const [passwordhash, setPasswordhash] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [sessionToken, setSessionToken] = React.useState<string | null>('');
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const [mountyPython, setMountyPython] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [responseStatus, setResponseStatus] = React.useState<number>(0);
    
    const loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value;

        switch (target.name) {
            case 'emailAddress':
                setEmailAddress(value);
                break;
            case 'passwordhash':
                setPasswordhash(value);
                break;
            case 'username':
                setUsername(value);
                break;
            default:
                break;
        }
    }

    const loginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // postgresql database call
        const response = await fetch(`${dbCall}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailAddress: emailAddress,
                passwordhash: passwordhash,
                username: username
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            props.setSessionToken(data.sessionToken);
            props.updateToken(data.sessionToken);
            setSessionToken(data.sessionToken);
            setErrorMessage('');
            setMountyPython(true);
            setIsLoggedIn(true);
            setUsername(data.username);
            setEmailAddress(data.emailAddress);
            navigate('/');
        } else {
            setErrorMessage(data.errorMessage);
        }
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
                            id="username"
                            name="username"
                            type="text"
                            // value is username OR emailAddress
                            value={username || emailAddress}
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
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
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