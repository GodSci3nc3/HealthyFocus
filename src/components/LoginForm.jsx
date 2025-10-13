"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

function LoginForm() {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const form = useRef(null);
    const router = useRouter();
    const { login } = useAuth();

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
                login(data.user);
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
            <form className='w-full' onSubmit={handleSubmit} ref={form}>
                <div className='mb-6'>
                    <label htmlFor="email" className='block text-[#2c2c2c] text-base font-medium mb-3'>
                        Email
                    </label>
                    <input 
                        className='w-full px-5 py-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-lg bg-white relative z-10' 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={user.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                        autoComplete="email"
                    />
                </div>

                <div className='mb-8'>
                    <label htmlFor="password" className='block text-[#2c2c2c] text-base font-medium mb-3'>
                        Contraseña
                    </label>
                    <input 
                        className='w-full px-5 py-4 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-lg bg-white relative z-10' 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={user.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button 
                    type="submit"
                    className='w-full bg-[#2c2c2c] text-white font-medium py-4 px-6 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 text-lg mb-4'
                >
                    Iniciar Sesión
                </button>
            </form>
            
            <div className='text-center'>
                <p className='text-[#666] text-base'>
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className='font-medium text-[#2c2c2c] hover:text-[#1a1a1a] transition-colors duration-300'>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;