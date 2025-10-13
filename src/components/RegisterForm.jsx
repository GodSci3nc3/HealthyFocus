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
            <form className='w-full' onSubmit={handleSubmit} ref={form}>
            <div className='mb-6'>
                <label htmlFor="name" className='block text-[#2c2c2c] text-base font-medium mb-3'>
                    Nombre de usuario
                </label>
                <input 
                    className='w-full px-5 py-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-lg bg-white' 
                    type="text" 
                    id="name" 
                    name="name" 
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    required
                />
            </div>

            <div className='mb-6'>
                <label htmlFor="email" className='block text-[#2c2c2c] text-base font-medium mb-3'>
                    Email
                </label>
                <input 
                    className='w-full px-5 py-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-lg bg-white' 
                    type="email" 
                    id="email" 
                    name="email" 
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                />
            </div>

            <div className='mb-6'>
                <label htmlFor="password" className='block text-[#2c2c2c] text-base font-medium mb-3'>
                    Contraseña
                </label>
                <input 
                    className='w-full px-5 py-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-lg bg-white' 
                    type="password" 
                    id="password" 
                    name="password" 
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
            </div>

            <div className='mb-8'>
                <label htmlFor="age" className='block text-[#2c2c2c] text-base font-medium mb-3'>
                    Edad
                </label>
                <input 
                    className='w-full px-5 py-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-lg bg-white' 
                    type="number" 
                    id="age" 
                    name="age" 
                    onChange={handleChange}
                    placeholder="25"
                    required
                />
            </div>

            <button 
                type="submit"
                className='w-full bg-[#2c2c2c] text-white font-medium py-4 px-6 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 text-lg mb-4'
            >
                Registrarse
            </button>
        </form>
        
        <div className='text-center'>
            <p className='text-[#666] text-base'>
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className='font-medium text-[#2c2c2c] hover:text-[#1a1a1a] transition-colors duration-300'>
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
    </div>
    );
}

export default RegisterForm;