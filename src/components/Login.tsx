import { ABCProps } from '../App';
import dbCall from '../helpers/Environments';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';

export type LoginState = {
    isAdmin: boolean;
    dbCall: string;
    emailAddress: string,
    errorMessage: string,
    fetchDb: () => Promise<void>;
    handleChange (event: React.ChangeEvent<HTMLInputElement>): void;
    handleSubmit (event: React.FormEvent<HTMLFormElement>): void;
    mountyPython: boolean,
    isLoggedIn: boolean,
    passwordhash: string,
    responseStatus: number,
    sessionToken: ABCProps['sessionToken'],
    setSessionToken: ABCProps['setSessionToken'],
    updateToken: ABCProps['updateToken']
    username: string,
    }

// User is able to login with either email or username, plus password being correct.
export const Login: React.FunctionComponent<{
    isAdmin: boolean;
    dbCall: string;
    fetchDb: () => Promise<void>;
    emailAddress: string;
    errorMessage: string;
    isLoggedIn: boolean;
    mountyPython: boolean;
    passwordhash: string;
    responseStatus: number;
    sessionToken: ABCProps['sessionToken'],
    setSessionToken: ABCProps['setSessionToken'];
    updateToken: ABCProps['updateToken'];
    username: string;
    handleChange (event: React.ChangeEvent<HTMLInputElement>): void;
    handleSubmit (event: React.FormEvent<HTMLFormElement>): void;

    }> = (props: LoginState) => {
    const navigate = useNavigate();
    const [emailAddress, setEmailAddress] = React.useState<string>('');
    const [passwordhash, setPasswordhash] = React.useState<string>('');
    const [username, setUsername] = React.useState<string>('');
    const [sessionToken, setSessionToken] = React.useState<string | null>('');
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
    const [mountyPython, setMountyPython] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [responseStatus, setResponseStatus] = React.useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // postgresql database call
        const response = await fetch(`${dbCall}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailAddress,
                passwordhash,
                username
            })
        });
        const responseData = await response.json();
        setResponseStatus(response.status);
        if (response.status === 200) {
            setSessionToken(responseData.sessionToken);
            setErrorMessage('');
            setMountyPython(true);
            setIsLoggedIn(true);
            setUsername(responseData.username);
            setEmailAddress(responseData.emailAddress);
            navigate('/');
        } else {
            setErrorMessage(responseData.errorMessage);
        }
    }

    // if they click the registration button, they are taken to the registration page
    // const handleRegister = () => {
    //     navigate('/register');
    // }

// return a login form. two fields. username/email and password.

    return (
        <div className="min-h-full flex">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <img
                            className="h-12 w-auto"
                            src="https://github.com/Alex-Lee-Myers/AllBallCallClient/blob/e0ca73fe63253d3f3fd953d992d4dbecb1a69874/src/assets/allballcall-500.svg"
                            alt="AllBallCall"
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            {/* register */}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register to call your shots.</Link>
                        </p>
                    </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-5 text-gray-700">
                        Username or Email Address
                    </label>
                    <div className="mt-1">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={[username, emailAddress]}
                            onChange={handleChange}
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
            className="absolute inset-0 h-full w-full object-cover"
            src="https://github.com/Alex-Lee-Myers/AllBallCallClient/blob/main/src/assets/loginSplash.jpg"
            alt=""
          />
        </div>
    </div>
    )
}