import { NextResponse } from 'next/server';
import { connection } from '@/libs/mysql';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: "User ID requerido" }, { status: 400 });
        }

        const tasks = await connection.query(
            `SELECT t.*, p.name as project_name 
             FROM tasks t 
             JOIN projects p ON t.project_id = p.id 
             WHERE t.user_id = ? 
             ORDER BY t.created_at DESC`,
            [userId]
        );

        return NextResponse.json({ tasks });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al obtener tareas: " + error },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { title, description, status, priority, projectId, userId } = await request.json();

        if (!title || !projectId || !userId) {
            return NextResponse.json({ message: "Título, project ID y user ID requeridos" }, { status: 400 });
        }

        const result = await connection.query("INSERT INTO tasks SET ?", {
            title,
            description: description || '',
            status: status || 'pendiente',
            priority: priority || 'media',
            project_id: projectId,
            user_id: userId
        });

        return NextResponse.json({
            message: "Tarea creada exitosamente",
            taskId: result.insertId
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al crear tarea: " + error },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ message: "ID y status requeridos" }, { status: 400 });
        }

        await connection.query(
            "UPDATE tasks SET status = ? WHERE id = ?",
            [status, id]
        );

        return NextResponse.json({ message: "Tarea actualizada exitosamente" });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al actualizar tarea: " + error },
            { status: 500 }
        );
    }
}