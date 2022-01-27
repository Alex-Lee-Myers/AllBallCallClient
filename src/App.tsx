import React from 'react';
import ReactPlayer from 'react-player';
// import the css
import './App.css';


function App() {
  // App.tsx that has an array of Streamable videos.
  // It then uses the Tailwind Aspect Ratio to create a carousel of videos from the array.
  // It uses ReactPlayer to play the videos.
  // const videos = [
  //   {
  //     url: 'https://streamable.com/u2n2fg',
  //     aspectRatio: '16:9',
  //   },
  //   {
  //     url: 'https://streamable.com/o0n8jh',
  //     aspectRatio: '16:9',
  //   },
  //   {
  //     url: 'https://streamable.com/5kminn',
  //     aspectRatio: '16:9',
  //   },
  //   {
  //     url: 'https://streamable.com/595ws8',
  //     aspectRatio: '16:9',
  //   },
  //   {
  //     url: 'https://streamable.com/pfamf9',
  //     aspectRatio: '16:9'
  //   }
  // ];

  const videos = [
    {
      id: 1,
      name: 'Shaq and Embiid',
      playerHighlighted: 'Talk Show',
      href: 'https://streamable.com/pfamf9',
      tag: 'NBA',
      src: 'https://streamable.com/pfamf9',
    },
    {
      id: 2,
      name: 'Sdd',
      playerHighlighted: 'Talk Show',
      href: 'https://streamable.com/pfamf9',
      tag: 'NBA',
      src: 'https://streamable.com/pfamf9',
    },
    {
      id: 3,
      name: 'Sdd',
      playerHighlighted: 'Talk Show',
      href: 'https://streamable.com/pfamf9',
      tag: 'NBA',
      src: 'https://streamable.com/pfamf9',
    },
    {
      id: 4,
      name: 'Sdd',
      playerHighlighted: 'Talk Show',
      href: 'https://streamable.com/pfamf9',
      tag: 'NBA',
      src: 'https://streamable.com/pfamf9',
    },
    {
      id: 5,
      name: 'Sdd',
      playerHighlighted: 'Talk Show',
      href: 'https://streamable.com/pfamf9',
      tag: 'NBA',
      src: 'https://streamable.com/pfamf9',
    },
    {
      id: 6,
      name: 'Sdd',
      playerHighlighted: 'Talk Show',
      href: 'https://streamable.com/pfamf9',
      tag: 'NBA',
      src: 'https://streamable.com/pfamf9',
    },
    // More videos...
  ]

    return (
      <div className="bg-white">
        <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-12">
            <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Trending</h2>
              <p className="text-xl text-gray-500">
                Ball don't lie.
              </p>
            </div>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              role="list"
              className="-mt-7 scroll-px-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8"
            >
              {videos.map((video) => (
                <li key={video.name} className="pb-5 ">
                  <div className=" space-y-2 space-x-2 shadow-lg rounded-lg  bg-red-400 ">
                    <div className="">
                      <ReactPlayer width={"100%"} url={video.src} id="react-player" className="rounded-lg "  />
                    </div>
  
                    <div className="space-y-2 ">
                      <div className="text-lg -mt-4 pb-5 leading-6 font-medium space-y-1">
                        <h3>{video.name}</h3>
                        <p className="text-indigo-600">{video.playerHighlighted}</p>
                      </div>
                      {/* <ul role="list" className="flex space-x-5">
                        <li>
                          <a href={video.team} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">{Team Name}</span>
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                              <path team picture here" /> }
                            </svg>
                          </a>
                        </li>
                        <li>
                          could put a second logo here of something for category or list out names
                        </li>
                      </ul> */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }


export default App;
