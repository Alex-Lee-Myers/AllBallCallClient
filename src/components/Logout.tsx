// when this component mounts, it will instanstly run clearToken: ABCtoken["clearToken"] from App.tsx and return the user to "/"
import React from "react";
import { ABCtoken } from "../App";
import { useNavigate } from "react-router-dom";


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
            setCountdownInterval(window.setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000));
        } else {
            props.clearToken();
            navigate("/");
        }
    }, [countdown, navigate, props]);

    return (
        <div className="logout-container">
            <h1>You are being logged out.</h1>

            <h2>Redirecting to the home page in {countdown} seconds.</h2>
        </div>
    );
}

export default Logout;