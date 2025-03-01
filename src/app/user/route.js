import {NextResponse} from 'next/server';


export function POST(){
    return NextResponse.json({message: "Creando perfil de usuario..."});
}