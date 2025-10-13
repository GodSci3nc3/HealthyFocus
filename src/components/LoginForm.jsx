"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
    const [user, setUser] = useState({
        email: '',
        password: ''
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Login exitoso:', data);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                console.log('Error en login');
            }
        } catch (error) {
            console.log('Error:', error);
        }

        form.current.reset();
    }

    return (
        <div>
            <form className='px-8 py-10 w-full' onSubmit={handleSubmit} ref={form}>
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
                        required
                    />
                </div>

                <div className='mb-8'>
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
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className='w-full bg-[#8B0000] text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 shadow-lg text-base mb-4'
                >
                    Iniciar Sesión
                </button>
            </form>
            
            <div className='text-center'>
                <p className='text-black text-base'>
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className='font-bold underline hover:text-gray-700 transition-colors'>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;