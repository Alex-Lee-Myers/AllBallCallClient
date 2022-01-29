
# AllBallCall

A full-stack web application that delivers the best basketball highlight experience you can receive. Curated videos, filtered, sorted, and save any of your favorites as well. This repo contains the client side of the application while the server side can be seen [here](https://github.com/Alex-Lee-Myers/AllBallCallServer).




![Logo](https://raw.githubusercontent.com/Alex-Lee-Myers/AllBallCallClient/142f52780f6baf70d168ccc10a470e8e4b03d40f/src/assets/allballcall-logo-500-white-text.svg)


## Author and Developer: Alex Lee Myers

- [Portfolio](https://alex-lee-myers.github.io/)
- [LinkedIn](https://www.linkedin.com/in/alexleemyers/)
- GitHub: [Alex-Lee-Myers](https://www.github.com/octokatherine)
- Email: Alexander.L.Myers@gmail.com
- Twitter: [@AlexLeeMe](https://twitter.com/AlexLeeMe)



## Heroku Deploy
[Click me]() to view the live deploy through Heroku.


## Server GitHub Repository
[Click me](https://github.com/Alex-Lee-Myers/AllBallCallServer) to view the Server repository for AllBallCall.


## FAQ

#### What is the stack?

P.E.R.N. (PostgreSQL, Express, React, Node.js)

#### What type of technologies were used?

Due to the nature of this project being required to reach MVP within 25 days, from server to client side, a host of packages were implemented to quicken progress on the client side. 

- TypeScript
- Tailwind CSS 3.0
- Headless UI
- React-Router-Dom
- React-Player

#### Who designed the logo? 

Well, I did! I have ove

#### Who designed the logo? 

Well, I did! I have over half a decade of experience in Illustrator and spent around 30 minutes on producing it.

#### What was your inspiration?

I am a die-hard NBA fan. In the midst of working a full-time job as well as averaging 5 hours a night coding for my part-time bootcamp with Eleven Fifty Academy, I was unable to watch any games or keep up. I started to rely on Twitter or Reddit.com/r/NBA for highlights yet both were cumbersome to do so. I wanted a one-stop shop where I could find the highlights I wanted to see --- so I decided to make it myself.

#### Do you plan on doing upkeep with this project and continuining its development?

Yes! Soon enough I will provide an experience beyond the scope of my intensive class. I may make it open-source in the future as well as I'd love to work with the community to build the best experience for all.

#### Are you looking for a job?

Indeed I am. Feel free to reach out to me via my [LinkedIn](https://www.linkedin.com/in/alexleemyers/) if you have positions available for front-end, back-end, and/or full-stack. 
## Roadmap

- **Week 1** (January 22nd through January 29th, 2022)
    - Completed MVP of Server.
    - Build out base structure of Client MVP.
    - Test client-side register and login.
    - Start implementing ReactPlayer and testing its functionality to ready for server fetch.
- **Week 2** (January 30th through February 5th, 2022)
    - ...
    - ...
    - ...
- **Week 3** (February 5th through February 12th, 2022)
    - ...
    - ...
    - ...
- **Week 4** (February 12th through February 19th, 2022)
    - Head to San Diego...🌞⛱
    - ...
    - ...
- **Week 5** (February 19th through February 22nd, 2022)
    - ...
    - ...
    - __Tuesday, February 22:__ Presentation Day
- **Continued Support** (March 2022 and beyond)
    - ...

## Log

| Date | Comments |
| ------ | ------ |
| [*1/22/22*](https://github.com/Alex-Lee-Myers/AllBallCallServer/commit/c6422976577104e6ba0784c0e8f187999dc833a3)  | Started my server build. Ran into extreme issues with PostgreSQL on my host computer that set me back a few hours. I ended up having to manually seek out all PostgreSQL related files within /AppData, /ProgramFiles, etc., delete them, then reinstall PostgreSQL from scratch.  |
| [*1/23/22*](https://github.com/Alex-Lee-Myers/AllBallCallServer/commit/c6422976577104e6ba0784c0e8f187999dc833a3)  | After snafu of previous day, spent nearly 10 hours on development of my server mostly betweem researching database associations, applying them, and continuing to narrow down the tables I'd need for MVP.|
| [*1/24/22* P.1](https://trello.com/b/LuH1VGa7/red-badge-allballcall) | Trello Board created. |
| [*1/24/22* P.2](https://github.com/Alex-Lee-Myers/AllBallCallServer/commit/44820135ac16a0cb5b13003f28f60f6a52fa9923)  | Continued finalizing database associations. Ran into issues with primary keys conflicting with foreign keys. Setup some potential stretch goal tables/models regarding bookmarks and upvote features. |
| [*1/25/22*](https://github.com/Alex-Lee-Myers/AllBallCallServer/commit/48c58cd370d9b799d0c5c728d6087bb45a57e300)  | Debugged my issues with table's being set incorrectly and now fully functional, tested all endpoints as well. |
| [*1/26/22*](https://github.com/Alex-Lee-Myers/AllBallCallClient/commit/72652b1a362ff4f0c89385e3e03a4e8553952e94)  | Finished up UI design of the NavBar. Built out extremely limited React-Router-Dom. Debugged issues ts-node was flagging regarding it. Still need to figure out drop-down of the Portfolio and create terenary depending on isLoggedIn state for Logout+Signin/Register.  |
| [*1/27/22* P.1](https://github.com/Alex-Lee-Myers/AllBallCallClient/commit/8c84411ec2918f78133e8edc4fdb866aafffdd1b)  | Tested ReactPlayer functionality. Minimal Tailwind UI integration with a card-style grid. Base structure working. Need to move to Home.tsx and then integrate fetching the server. |
| [*1/27/22* P.2](https://github.com/Alex-Lee-Myers/AllBallCallClient/commit/142f52780f6baf70d168ccc10a470e8e4b03d40f)  | Started build up of Login UI. Needs a lot more work before functional. Additionally, did a copy-paste into Register file for a base start. Will touch that after Login finished. |
| [*1/28/22*]() | Working on Login+Register further and testing. Navbar dropdown as well. |
