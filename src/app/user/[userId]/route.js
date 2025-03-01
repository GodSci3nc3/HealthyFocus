import { NextResponse } from "next/server";

export function GET (){
    return NextResponse.json("Obteniendo perfil de usuario");
}

export function DELETE (){
    return NextResponse.json("Eliminando perfil de usuario");
}

export function PUT (){
    return NextResponse.json("Actualizando perfil de usuario");
}