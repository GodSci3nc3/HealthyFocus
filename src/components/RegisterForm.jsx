"use client"
import { useState, useRef } from 'react';
import axios from 'axios';

function RegisterForm() {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });

    const form = useRef(null);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await axios.post('/user', user);

        console.log(res);

        form.current.reset();

    }

    return (

        <form className='bg-white shadow-md rounded px-8 pt-6 pb-25 mb-4 ' onSubmit={handleSubmit} ref = {form}>

            <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-2'>Nombre de usuario</label>
            <input className='shadow appearance-none border rounded w-full py-2 px-3' type="username" id="name" name="name" onChange={handleChange} />

            <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
            <input className='shadow appearance-none border rounded w-full py-2 px-3' type="email" id="email" name="email" onChange={handleChange} />

            <label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
            <input className='shadow appearance-none border rounded w-full py-2 px-3' type="password" id="password" name="password" onChange={handleChange} />


            <label htmlFor="age" className='block text-gray-700 text-sm font-bold mb-2'>Edad</label>
            <input className='shadow appearance-none border rounded w-full py-2 px-3' type="number" id="age" name="age" onChange={handleChange} />


            <button type="submit">Login</button>
        </form>

    );
}

export default RegisterForm;