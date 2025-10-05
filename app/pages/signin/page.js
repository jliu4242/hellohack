'use client'
import { useEffect, useState } from 'react'
import "../../styles/auth.css"
import dynamic from 'next/dynamic';

// disable SSR for FirebaseUI (browser only)
const FirebaseAuthUI = dynamic(() => import('../../components/firebaseAuthUI.js'), { ssr: false });

export default function signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    return (
        <div className = 'h-screen bg-[#EDEEF0] flex justify-center items-center'>
            <div className='h-3/4 w-2/5 bg-white'>
                <form className='flex flex-col justify-center p-10 pl-30 pr-30 divide-y space-y-7'>
                    <div className='w-full'>
                        <FirebaseAuthUI />
                    </div>
                    <div className="flex items-center w-full">
                        <div className="flex-grow border-t border-black"></div>
                        <span className="mx-4 text-black">OR CONTINUE WITH EMAIL</span>
                        <div className="flex-grow border-t border-black"></div>
                    </div>

                    <div className='flex flex-col'>
                        <label className='text-black'>Email</label>
                        <input type='email' 
                            placeholder='email' 
                            value={email}
                            autoComplete='off'
                            onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className='flex flex-col'>
                        <label className='text-black'>Password</label>
                        <input type='password' 
                        placeholder='password' 
                        value={password}
                        autoComplete='new-password'
                        onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className='bg-black flex justify-center items-center rounded-2xl border h-12'>
                        <button>Sign In</button>
                    </div>

                    <div className='flex justify-center items-center text-black'>
                        Don't have an account? Sign Up
                    </div>

                </form>
            </div>
        </div>
    )
}

