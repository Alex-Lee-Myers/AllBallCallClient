import React, { Component, Fragment } from "react";
// import PropTypes from 'prop-types';
/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { PlusSmIcon } from "@heroicons/react/solid";
import { Navigation } from "@mui/icons-material";

interface user {
    name: string;
    email: string;
    imageUrl: string;
    }

interface navigation {
    name: string;
    href: string;
    current: boolean;
}

interface userNavigation {
    name: string;
    href: string;
}


class navbar extends Component<
    {},
    {
        user: user;
        navigation: navigation[];
        userNavigation: userNavigation[];
    }
> {
constructor(props: any) {
    super(props);
    this.state = {
    user: {
        name: 'Tom Cook',
        email: 'tom@example.com',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    navigation: [
        {
        name: "Trending",
        href: "#",
        current: true,
        },
        {
        name: "Video Grid",
        href: "#",
        current: false,
        },
        {
        name: "Streamable",
        href: "#",
        current: false,
        },
        {
            name: "Admin Dashboard",
            href: "#",
            current: false,
        }
    ],
    userNavigation: [
    {
        name: "Your Park",
        href: "#",
    },
    {
        name: "Settings",
        href: "#",
    },
    {
        name: "Logout",
        href: "/logout",
    },
    ],
    };
}

    render() {
        return (
            <Disclosure as="nav" className="bg-gray-800">
                {({open}) => (
                    <>
                        <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    <div className="-ml-2 mr-2 flex items-center md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                    </Disclosure.Button>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                    <img
                        className="block lg:hidden h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                        alt="Workflow"
                    />
                    <img
                        className="hidden lg:block h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                        alt="Workflow"
                    />
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                        <navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`${item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}, 'px-3 py-2 rounded-md text-sm font-medium'`}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                  >
                    <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    <span>New Job</span>
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                  <button
                    type="button"
                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"></Menu.Items>
                            {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                    {({active}) => (
                                        <a
                                            
                                            href={item.href}
                                            className={`${active ? "bg-gray-100" : "block px-4 py-2 text-sm text-gray-700"} hover:bg-gray-100`}
                                        >
                                            {item.name}
                                        </a>
                                </Menu.Item>
                            ))}
                    </Transition>
                    </Menu>
                </div>
            </div>
            </div>
            </div>
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}



export default navbar;
