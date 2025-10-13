"use client"
import { useState, useEffect } from 'react';
import LoginForm from "@/components/LoginForm";

function LoginPage() {
    const [titleMoved, setTitleMoved] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTitleMoved(true);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='min-h-screen bg-gradient-radial from-[#ff5757] to-[#9e005d] p-4'>
            <div className={`transition-all duration-700 ease-out ${
                titleMoved 
                    ? 'transform translate-y-0 scale-100' 
                    : 'transform translate-y-[40vh] scale-150'
            }`}>
                <h1 className='text-6xl md:text-8xl font-black text-black text-center mb-2 tracking-tight font-impact'>
                    HEALTHY FOCUS
                </h1>
            </div>
            
            <div className={`w-full text-center transition-all duration-500 ${
                titleMoved ? 'opacity-100' : 'opacity-0'
            }`}>
                <p className='text-black font-bold text-lg mb-8 tracking-widest'>
                    FOCUS ON WHATS MATTERS
                </p>
            </div>

            <div className={`flex justify-center items-start transition-all duration-500 ${
                titleMoved ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className='w-full flex items-center justify-between px-8'>
                    <div className='w-full lg:w-1/2 max-w-lg mx-auto'>
                        <LoginForm />
                    </div>
                    
                    <div className='hidden lg:block w-1/2 pl-12'>
                        <img 
                            src="/goalKeeper.png" 
                            alt="Arquero apuntando al blanco" 
                            className='w-full h-auto'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;