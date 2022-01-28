import React from 'react';

// import the css
import './App.css';
// import the components
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import Home from './components/home';
import Navbar from './components/navbar';



function App() {

    return (
      <div className="App">
        <Navbar>
          {/* clearSessionToken={clearSessionToken}
          setSessionToken={setSessionToken}
          sessionToken={sessionToken}
          isLoggedIn={isLoggedIn} */}
        </Navbar>

        {/* <Routes>

        <Route path="/" element={<Home

          
          />} 
        />

        </Routes> */}
      </div>
    );
  }


export default App;
