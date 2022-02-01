//import interfaces from App.tsx
import { ABCtoken} from '../App'
import dbCall from '../helpers/Environments';
import { useNavigate, Link } from 'react-router-dom';
import React, { Component } from 'react';

export type LoginState = {
    id: string;
    isAdmin: boolean;
    emailAddress: string,
    errorMessage: string,
    loginDb: () => Promise<void>;
    loginChange (event: React.ChangeEvent<HTMLInputElement>): void;
    loginSubmit (event: React.FormEvent<HTMLFormElement>): void;
    mountyPython: boolean,
    isUserLoggedIn: boolean,
    passwordhash: string,
    responseStatus: number,
    sessionToken: ABCtoken['sessionToken'],
    setSessionToken: ABCtoken['setSessionToken'],
    updateToken: ABCtoken['updateToken'],
    username: string,
    }

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
        const response = await fetch(`${dbCall}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailAddress,
                passwordhash,
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
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Login</h1>

                    <form onSubmit={loginSubmit}>

                        <div className="form-group">
                            <label htmlFor="emailAddress">Email address</label>
                            <input

                                type="email"
                                className="form-control"
                                id="emailAddress"
                                name="emailAddress"
                                value={emailAddress}
                                onChange={loginChange}
                                placeholder="Enter email"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="passwordhash">Password</label>
                            <input

                                type="password"
                                className="form-control"
                                id="passwordhash"
                                name="passwordhash"
                                value={passwordhash}
                                onChange={loginChange}
                                placeholder="Password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    <p>{errorMessage}</p>
                    <p>{sessionToken}</p>
                    <p>{username}</p>
                    <p>{emailAddress}</p>
                    <p>{passwordhash}</p>
                    <p>{isLoggedIn}</p>
                    <p>{mountyPython}</p>
                    <p>{responseStatus}</p>
                </div>
            </div>
        </div>
    )
}


// User is able to login with either email or username, plus password being correct.
//! Class version
// class Login extends React.Component<{
//     sessionToken: ABCtoken['sessionToken']
//     updateToken: ABCtoken['updateToken']
//     setSessionToken: ABCtoken['setSessionToken']
// }, LoginState> {
//     constructor(props: LoginState) {
//         super(props);

//         this.state = {
//             id: '',
//             isAdmin: false,
//             emailAddress: '',
//             errorMessage: '',
//             loginDb: () => Promise.resolve(),
//             mountyPython: false,
//             isLoggedIn: false,
//             passwordhash: '',
//             responseStatus: 0,
//             sessionToken: '',
//             setSessionToken: () => {},
//             updateToken: () => {},
//             username: '',
//             loginChange: this.loginChange,
//             loginSubmit: this.loginSubmit,
//         }
//         this.loginChange = this.loginChange.bind(this);
//         this.loginSubmit = this.loginSubmit.bind(this);
//     }

//     navigate = useNavigate();

//     loginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const target = event.target;
//         const value = target.value;
        
//         // login change of text input without using Switch
//         switch (target.name) {
//             case 'emailAddress':
//                 this.setState({emailAddress: value});
//                 break;
//             case 'passwordhash':
//                 this.setState({passwordhash: value});
//                 break;
//             case 'username':
//                 this.setState({username: value});
//                 break;
//             default:
//                 break;
//         }
//     };

//     loginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         // postgresql database call
//         await login(`${dbCall}/userslogin`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     username: this.state.username,
//                     email: this.state.emailAddress,
//                     passwordhash: this.state.passwordhash,
//                 })
//             })
//             .then(response => {
//                 if (response.status === 200) {
//                     return response.json();
//                 } else {
//                     this.setState({
//                         errorMessage: 'Incorrect username or password.',
//                         responseStatus: response.status
//                     });
//                 }
//             }
//             )
//             .then(data => {
//                 if (data) {
//                     this.setState({
//                         isLoggedIn: true,
//                         sessionToken: data.sessionToken,
//                         username: data.username,
//                         emailAddress: data.email,
//                         errorMessage: '',
//                         responseStatus: 200,
//                         isAdmin: data.isAdmin,
//                         id: data.id,
//                     });
//                     this.props.setSessionToken(data.sessionToken);
//                     this.props.updateToken(data.sessionToken);
//                     this.navigate('/');
//                 }
//             }
//             )
//             .catch(error => {
//                 this.setState({
//                     errorMessage: 'Incorrect username or password.',
//                     responseStatus: error.status
//                 });
//             });
//     };


//     render() {
//         return (
//             <div className="login-container">
//                 <div className="login-form">
//                     <form onSubmit={this.loginSubmit}>
//                         <div className="login-form-header">
//                             <h1>Login</h1>
//                         </div>
//                         <div className="login-form-body">
//                             <div className="login-form-input">
//                                 <label htmlFor="username">Username</label>

//                                 <input
//                                     type="text"
//                                     name="username"
//                                     id="username"
//                                     value={this.state.username}
//                                     onChange={this.loginChange}
//                                 />
//                             </div>
//                             <div className="login-form-input">
//                                 <label htmlFor="emailAddress">Email Address</label>

//                                 <input
//                                     type="text"
//                                     name="emailAddress"
//                                     id="emailAddress"
//                                     value={this.state.emailAddress}
//                                     onChange={this.loginChange}
//                                 />
//                             </div>
//                             <div className="login-form-input">
//                                 <label htmlFor="passwordhash">Password</label>
                                
//                                 <input
//                                     type="password"
//                                     name="passwordhash"
//                                     id="passwordhash"
//                                     value={this.state.passwordhash}
//                                     onChange={this.loginChange}
//                                 />
//                             </div>
//                             <div className="login-form-input">
//                                 <button type="submit">Login</button>
//                             </div>
//                             <div className="login-form-input">
//                                 <Link to="/register">Register</Link>
//                             </div>
//                             <div className="login-form-input">
//                                 <p>{this.state.errorMessage}</p>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
// }




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


    

//     render(): React.ReactNode {
//     return (
//         <div className="min-h-full flex">
//             <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
//                 <div className="mx-auto w-full max-w-sm lg:w-96">
//                     <div>
//                         <img
//                             className="h-12 w-auto"
//                             src="https://github.com/Alex-Lee-Myers/AllBallCallClient/blob/e0ca73fe63253d3f3fd953d992d4dbecb1a69874/src/assets/allballcall-500.svg"
//                             alt="AllBallCall"
//                         />
//                         <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
//                         <p className="mt-2 text-sm text-gray-600">
//                             Or{' '}
//                             {/* register */}
//                             <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register to call your shots.</Link>
//                         </p>
//                     </div>

//             <form className="space-y-6" onSubmit={this.loginSubmit}>
//                 <div>
//                     <label htmlFor="username" className="block text-sm font-medium leading-5 text-gray-700">
//                         Username or Email Address
//                     </label>
//                     <div className="mt-1">
//                         <input
//                             id="username"
//                             name="username"
//                             type="text"
//                             // value is username OR emailAddress
//                             value={this.state.username || this.state.emailAddress}
//                             onChange={this.loginChange}
//                             required
//                             className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         />
//                     </div>
//                 </div>
            

//             <div className="space-y-1">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                 </label>
//                 <div className="mt-1">
//                     <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="current-password"
//                     required
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     />
//                 </div>
//             </div>
//                     <div>
//                         <button
//                             type="submit"
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                             Sign in
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//         <div className="hidden lg:block relative w-0 flex-1">
//             <img
//                 className="absolute inset-0 h-full w-full object-cover"
//                 src="https://github.com/Alex-Lee-Myers/AllBallCallClient/blob/main/src/assets/loginSplash.jpg"
//                 alt=""
//             />
//         </div>
//     </div>
//     )
// }
// }

export default Login;