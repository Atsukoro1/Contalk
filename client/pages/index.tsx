import { NextPage } from "next";
import { useState } from "react";

import SideImage from "../components/SideImage";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

const HomePage : NextPage = () => {
  const [loginModOpened, setLoginModOpened] = useState<boolean>(false);
  const [registerModOpened, setRegisterModOpened] = useState<boolean>(false);

  function handleLoginModalState(opened: boolean) {
    setLoginModOpened(opened);
  };

  function handleRegisteModalState(opened: boolean) {
    setRegisterModOpened(opened);
  };

  return (
  <div className='bg-background bg-no-repeat bg-cover h-screen w-screen'>
    <nav className="bg-blue-800">
      <div className="max-w-7xl ml-14 px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>

              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>

              <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img className="block lg:hidden h-8 w-auto" src="/logo500x500.png" alt="Workflow" />
              <img className="hidden lg:block h-8 w-auto" src="/logo500x500.png" alt="Workflow" />
            </div>

            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page">Github</a>
                <a href="#"
                  className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Docs</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="bg-blue-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            aria-current="page">Github</a>
          <a href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Docs</a>
        </div>
      </div>
    </nav>

    <div style={{ gridTemplateColumns: "auto auto" }} className="grid mt-60 w-screen">
      <div className='place-self-start ml-24'>
        <h1 className='text-white font-extrabold text-7xl'>
          The chat application<br /> you will simply love
        </h1>

        <p className='text-white text-2xl mt-4'>
          We created a chat application that much<br />
          simple to use, that you will simply love it
        </p>

        <div className='mt-5'>
          <button
            onClick={() => {
              setRegisterModOpened(true);
            }}
            className="bg-blue-700 hover:bg-blue-800 focus:ring-4 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
            Create a new account
          </button>

          <button 
            onClick={()=> {
              setLoginModOpened(true);
            }} 
            className="bg-blue-700 hover:bg-blue-800 focus:ring-4
            text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
            Already have an account
          </button>
        </div>
      </div>

      <div className="place-self-end mr-24 -mt-24 2xl:inline">
        <SideImage />
      </div>
    </div>

      <div className={
        loginModOpened ? ""
        : 'hidden'
      }>
        <LoginModal setLoginModOpened={handleLoginModalState}></LoginModal>
      </div>

      <div className={
        registerModOpened ? ""
        : 'hidden'
      }>
        <RegisterModal setRegisterModOpened={handleRegisteModalState}></RegisterModal>
      </div>
    </div>
    )
    };

    export default HomePage;