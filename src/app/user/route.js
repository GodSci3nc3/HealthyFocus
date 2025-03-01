import {NextResponse} from 'next/server';
import {connection} from '@/libs/mysql';


export async function POST(request){
try {
    const {name, email, password, age} = await request.json();

    const result = await connection.query("INSERT INTO users SET ?", 
    {
        name: name,
        email: email,
        password: password,
        age: age
    }
    );

    console.log(result);

    return NextResponse.json({message: "Creando perfil de usuario..."});
} catch (error) {
    console.log(error);
    return NextResponse.json({message: "Error al crear perfil de usuario..." + error}, {status: 500});
    
}
}