import { NextResponse } from "next/server";
import { connection } from "@/libs/mysql";

export async function GET(request, { params }) {

    try {
        const result = await connection.query('SELECT * FROM users WHERE id = ?', [params.id]);


        if (result.length === 0) { return NextResponse.json({ status: 404, message: "Usuario no encontrado" }); }

        return NextResponse.json({ message: "Perfil de usuario", data: result[0] });
    } catch (error) {
        return NextResponse.json({
            message: error.message,
        },
            { status: 500 });
    }
}

export async function DELETE(request, { params }) {

    try {
        const result = await connection.query('DELETE FROM users WHERE id = ?', [params.id]);
        if (result.affectedRows === 0) { return NextResponse.json({ status: 404, message: "Usuario no encontrado" }); }
        return NextResponse.json("Eliminando perfil de usuario");
    } catch (error) {
        return NextResponse.json({
            message: error.message,
        },
            { status: 500 });

    }
}

export async function PUT(request, { params }) {

try {
    const data = await request.json();
    const result = await connection.query('UPDATE users SET ? WHERE id = ?', [data, params.id]);


    console.log(result);
    if (result.affectedRows === 0) { return NextResponse.json({ status: 404, message: "Usuario no encontrado" }); }
    return NextResponse.json("Actualizando perfil de usuario");
} catch (error) {
    return NextResponse.json({
        message: error.message,
    },
        { status: 500 });
}
}