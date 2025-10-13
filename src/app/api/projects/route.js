import { NextResponse } from 'next/server';
import { connection } from '@/libs/mysql';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "User ID requerido" }, { status: 400 });
        }

        const projects = await connection.query(
            "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        return NextResponse.json({ projects });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al obtener proyectos: " + error },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { name, description, userId } = await request.json();

        if (!name || !userId) {
            return NextResponse.json({ message: "Nombre y user ID requeridos" }, { status: 400 });
        }

        const result = await connection.query("INSERT INTO projects SET ?", {
            name,
            description: description || '',
            user_id: userId
        });

        return NextResponse.json({
            message: "Proyecto creado exitosamente",
            projectId: result.insertId
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al crear proyecto: " + error },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');

        if (!projectId) {
            return NextResponse.json({ message: "ID del proyecto requerido" }, { status: 400 });
        }

        // Primero eliminar todas las tareas del proyecto
        await connection.query("DELETE FROM tasks WHERE project_id = ?", [projectId]);
        
        // Luego eliminar el proyecto
        const result = await connection.query("DELETE FROM projects WHERE id = ?", [projectId]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Proyecto eliminado exitosamente" });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al eliminar proyecto: " + error },
            { status: 500 }
        );
    }
}