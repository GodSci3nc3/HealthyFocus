import { NextResponse } from 'next/server';
import { connection } from '@/libs/mysql';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const result = await connection.query(
            "SELECT * FROM users WHERE email = ? AND password = ?", 
            [email, password]
        );

        if (result.length > 0) {
            const user = result[0];
            return NextResponse.json({
                message: "Login exitoso",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    age: user.age
                }
            });
        } else {
            return NextResponse.json(
                { message: "Email o contraseña incorrectos" }, 
                { status: 401 }
            );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al iniciar sesión: " + error }, 
            { status: 500 }
        );
    }
}