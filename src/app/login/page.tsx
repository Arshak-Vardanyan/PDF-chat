'use client'

import React, {useState} from "react";
import {  FiEyeOn,FiEyeOff,LinkoriumLogo } from "../components/svgFiles";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "on";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe: rememberMe ? 1 : 0 }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError("Invalid login credentials. Please try again.");
        return;
      }
      localStorage.setItem("token", data.access_token);
      window.location.href = "/chat"

    } catch (error) {
      setError("Something went wrong");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  
    return (
      <>
        <div className="flex bg-white text-black  min-h-full flex-1 flex-col justify-center py-8 sm:px-6 lg:px-4 relative">
          <LinkoriumLogo/>
  
            <h2 className="text-[#202326] text-center tracking-wide font-inter text-[24px] not-italic mt-6 font-medium leading-[28px]  ">
              Sign in to your account
            </h2>
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[530px]">
            <div className="flex flex-col items-center self-stretch bg-white px-8 py-12 shadow sm:rounded-2xl sm:px-8">
              <form onSubmit={handleSubmit} method="POST" className="space-y-6 flex flex-col items-start self-stretch">
               <div className="flex flex-col items-start gap-8 self-stretch">
                <div className="flex flex-col items-start  self-stretch">
                  <label htmlFor="email" className="text-[#202326] font-inter block text-[14px] not-italic font-medium leading-[17px]">
                    Email address
                  </label>
                  <div className="mt-2 w-full">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="block w-full flex-[1_0_0] rounded-md bg-white px-3 py-1.5 text-gray-900 outline  -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
  
                <div className="flex flex-col items-start self-stretch">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2 w-full relative">
                    <input
                      id="password"
                      name="password"
                      type={show ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      className="block w-full flex-[1_0_0] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <div onClick={()=>setShow(!show)} className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'>
                      {show?<FiEyeOn/>:<FiEyeOff/>}
                    </div>
                  </div>
                  <p className='text-red-600'>
                    {error.length > 0 ? error : '' }
                  </p>
                </div>
              </div>
  
                <div className="w-full">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-[#006BE5] px-3 py-[10px] text-[16px] not-italic font-medium leading-[19px] text-[#FFF] text-center font-inter  shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {loading?'Loading ...': 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }