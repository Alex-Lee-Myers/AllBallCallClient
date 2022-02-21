// when this component mounts, it will instanstly run clearToken: ABCtoken["clearToken"] from App.tsx and return the user to "/"
import React from "react";
import { ABCtoken } from "../App";
import { useNavigate, Link } from "react-router-dom";

interface LogoutProps {
	clearToken: ABCtoken["clearToken"];
}

//TODO could style this into a cool looking page if I have time to.

const Logout = (props: LogoutProps) => {
	// On page loads, it tells the user "You are being logged out (countdown timer)." </br> "You will be redirected to the home page in 5 seconds."
	// When the countdown timer reaches 0, it will run the clearToken function from App.tsx and return the user to "/".
	const navigate = useNavigate();
	const [countdown, setCountdown] = React.useState<number>(3);
	const [countdownInterval, setCountdownInterval] = React.useState<number>(0);

	React.useEffect(() => {
		if (countdown > 0) {
			props.clearToken();
			setCountdownInterval(
				window.setInterval(() => {
					setCountdown(countdown - 1);
				}, 1000)
			);
		} else {
			navigate("/");
		}
	}, [countdown, navigate, props]);

	return (
		<>
			<div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
				<div className="max-w-max mx-auto">
					<main className="sm:flex">
						<p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
							{countdown}
						</p>
						<div className="sm:ml-6">
							<div className="sm:border-l sm:border-gray-200 sm:pl-6">
								<h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
									Logging Out...
								</h1>
								<p className="mt-1 text-base text-gray-500">
									Redirecting you to the home page.
								</p>
							</div>
							<div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
								<Link
									to="/"
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Go back home
								</Link>
								<Link
									to="/login"
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Contact support
								</Link>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
};

export default Logout;
