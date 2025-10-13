"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

function RegisterForm() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });

    const form = useRef(null);
    const router = useRouter();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post('/user', user);
            console.log('Registro exitoso:', res);
            router.push('/login');
        } catch (error) {
            console.log('Error en registro:', error);
        }
        
        form.current.reset();
    }

    return (
        <div>
            <form className='px-8 py-10 w-full' onSubmit={handleSubmit} ref={form}>
            <div className='mb-6'>
                <label htmlFor="name" className='block text-black text-base font-bold mb-2'>
                    Nombre de usuario
                </label>
                <input 
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-base' 
                    type="text" 
                    id="name" 
                    name="name" 
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                />
            </div>

            <div className='mb-6'>
                <label htmlFor="email" className='block text-black text-base font-bold mb-2'>
                    Email
                </label>
                <input 
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-base' 
                    type="email" 
                    id="email" 
                    name="email" 
                    onChange={handleChange}
                    placeholder="tu@email.com"
                />
            </div>

            <div className='mb-6'>
                <label htmlFor="password" className='block text-black text-base font-bold mb-2'>
                    Contraseña
                </label>
                <input 
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-base' 
                    type="password" 
                    id="password" 
                    name="password" 
                    onChange={handleChange}
                    placeholder="••••••••"
                />
            </div>

            <div className='mb-8'>
                <label htmlFor="age" className='block text-black text-base font-bold mb-2'>
                    Edad
                </label>
                <input 
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-base' 
                    type="number" 
                    id="age" 
                    name="age" 
                    onChange={handleChange}
                    placeholder="25"
                />
            </div>

            <button 
                type="submit"
                className='w-full bg-[#8B0000] text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 shadow-lg text-base'
            >
                Registrarse
            </button>
        </form>
        
        <div className='text-center'>
            <p className='text-black text-base'>
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className='font-bold underline hover:text-gray-700 transition-colors'>
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
    </div>
    );
}

export default RegisterForm;