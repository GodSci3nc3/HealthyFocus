import { NextResponse } from 'next/server';
import { connection } from '@/libs/mysql';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "User ID requerido" }, { status: 400 });
        }

        const notes = await connection.query(
            "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        return NextResponse.json({ notes });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al obtener notas: " + error },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { title, content, userId } = await request.json();

        if (!title || !userId) {
            return NextResponse.json({ message: "Título y user ID requeridos" }, { status: 400 });
        }

        const result = await connection.query("INSERT INTO notes SET ?", {
            title,
            content: content || '',
            user_id: userId
        });

        return NextResponse.json({
            message: "Nota creada exitosamente",
            noteId: result.insertId
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al crear nota: " + error },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const noteId = searchParams.get('id');

        if (!noteId) {
            return NextResponse.json({ message: "ID de nota requerido" }, { status: 400 });
        }

        await connection.query("DELETE FROM notes WHERE id = ?", [noteId]);

        return NextResponse.json({ message: "Nota eliminada exitosamente" });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al eliminar nota: " + error },
            { status: 500 }
        );
    }
}