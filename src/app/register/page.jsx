"use client"
import { useState, useEffect } from 'react';
import RegisterForm from "@/components/RegisterForm";

function RegisterPage() {
    const [animationPhase, setAnimationPhase] = useState('initial'); // 'initial', 'moved', 'complete'

    useEffect(() => {
        // Fase 1: Título se mueve hacia arriba después de 2 segundos
        const timer1 = setTimeout(() => {
            setAnimationPhase('moved');
        }, 2000);

        // Fase 2: Mostrar contenido después de que termine la animación (0.6 segundos)
        const timer2 = setTimeout(() => {
            setAnimationPhase('complete');
        }, 2600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
            {/* Título con animación centrada */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-[600ms] ease-out ${
                animationPhase === 'initial' 
                    ? 'transform translate-y-0' 
                    : 'transform -translate-y-[40vh]'
            }`}>
                <h1 
                    className={`font-black text-[#2c2c2c] transition-all duration-[600ms] ease-out ${
                        animationPhase === 'initial' 
                            ? 'text-9xl' 
                            : 'text-7xl'
                    }`}
                    style={{
                        fontFamily: 'Bebas Neue, cursive'
                    }}
                >
                    HealthyFocus
                </h1>
            </div>

            {/* Contenido principal (aparece después de la animación) */}
            <div className={`flex h-screen transition-all duration-500 ${
                animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'
            }`}>
                {/* Left Side - Arquero */}
                <div className='w-1/2 flex items-center justify-center p-2'>
                    <img 
                        src="/goalKeeper.png" 
                        alt="Arquero apuntando al blanco" 
                        className='w-full h-auto max-w-4xl'
                    />
                </div>
                
                {/* Right Side - Form */}
                <div className="w-1/2 flex flex-col justify-center p-8">
                    <div className="w-full max-w-lg mx-auto">
                        <div className="text-center mb-8">
                            <p className='text-[#666] text-xl'>
                                Crea una cuenta
                            </p>
                        </div>

                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
