//import interfaces from App.tsx
import { ABCtoken} from '../App'
import dbCall from '../helpers/Environments';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';

export type LoginState = {
    isAdmin: boolean;
    emailAddress: string,
    errorMessage: string,
    fetchDb: () => Promise<void>;
    handleChange (event: React.ChangeEvent<HTMLInputElement>): void;
    handleSubmit (event: React.FormEvent<HTMLFormElement>): void;
    mountyPython: boolean,
    isLoggedIn: boolean,
    passwordhash: string,
    responseStatus: number,
    sessionToken: ABCtoken['sessionToken'],
    setSessionToken: ABCtoken['setSessionToken'],
    updateToken: ABCtoken['updateToken'],
    username: string,
    }

// User is able to login with either email or username, plus password being correct.
class Login extends React.Component<{
    sessionToken: ABCtoken['sessionToken']
    updateToken: ABCtoken['updateToken']
    setSessionToken: ABCtoken['setSessionToken']
}, LoginState> {
    constructor(props: LoginState) {
        super(props);

        this.state = {
            isAdmin: false,
            emailAddress: '',
            errorMessage: '',
            fetchDb: () => Promise.resolve(),
            mountyPython: false,
            isLoggedIn: false,
            passwordhash: '',
            responseStatus: 0,
            sessionToken: '',
            setSessionToken: () => {},
            updateToken: () => {},
            username: '',
            handleChange: this.handleChange,
            handleSubmit: this.handleSubmit,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    navigate = useNavigate();

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value;
        
        switch (target.name) {
            case 'emailAddress':
                this.setState({emailAddress: value});
                break;
            case 'passwordhash':
                this.setState({passwordhash: value});
                break;
            case 'username':
                this.setState({username: value});
                break;
            default:
                break;
        }
    };

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // postgresql database call
        const fetchDb = async (): Promise<void> => {
            const response = await fetch(`${dbCall}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.emailAddress,
                    passwordhash: this.state.passwordhash,
                })
            });
            const responseJson = await response.json();
            this.setState({responseStatus: response.status});
            if (response.status === 200) {
                this.setState({
                    isLoggedIn: true,
                    sessionToken: responseJson.sessionToken,
                    updateToken: responseJson.updateToken,
                });
                this.props.setSessionToken(responseJson.sessionToken);
                this.props.updateToken(responseJson.updateToken);
            } else {
                this.setState({errorMessage: responseJson.error});
            }
        };
    };

    // componentDidMount = () => {
    //     this.setState({ 
    //         setSessionToken: this.props.setSessionToken,
    //         updateToken: this.props.updateToken,
    //         sessionToken: this.props.sessionToken,
    //     });
    // };

    // componentDidUpdate = () => {
    //     if (this.state.isLoggedIn === true && this.state.responseStatus === 200 && this.state.sessionToken !== '' && this.state.isAdmin !== true) {
    //         this.props.sessionToken ? this.navigate('/') : this.navigate('/login');
    //     }

    //     if (this.state.isLoggedIn === true && this.state.responseStatus === 200 && this.state.sessionToken !== '' && this.state.isAdmin === true) {
    //         this.props.sessionToken ? this.navigate('/admin') : this.navigate('/login');
    //     }
    // };

    // componentDidCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    //     console.error("Login componentDidCatch: ", error, errorInfo);
    // };


    render(): React.ReactNode {
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

            <form className="space-y-6" onSubmit={this.handleSubmit}>
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
                            value={this.state.username || this.state.emailAddress}
                            onChange={this.handleChange}
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
}

export default Login;