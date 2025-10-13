"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [todayTask, setTodayTask] = useState(null);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            router.push('/login');
            return;
        }
        
        const currentUser = JSON.parse(userData);
        setUser(currentUser);
        loadData(currentUser.id);
    }, []);

    const loadData = async (userId) => {
        try {
            const [projectsRes, tasksRes, notesRes] = await Promise.all([
                fetch(`/api/projects?userId=${userId}`),
                fetch(`/api/tasks?userId=${userId}`),
                fetch(`/api/notes?userId=${userId}`)
            ]);

            const projectsData = await projectsRes.json();
            const tasksData = await tasksRes.json();
            const notesData = await notesRes.json();

            setProjects(projectsData.projects || []);
            const allTasks = tasksData.tasks || [];
            setTasks(allTasks);
            setNotes(notesData.notes || []);

            // Seleccionar tarea del día (primera pendiente o en proceso)
            const mainTask = allTasks.find(task => task.status === 'en_proceso') || 
                           allTasks.find(task => task.status === 'pendiente');
            setTodayTask(mainTask);
        } catch (error) {
            console.log('Error cargando datos:', error);
        }
    };

    const createNote = async () => {
        if (!newNote.title.trim()) return;

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newNote.title,
                    content: newNote.content,
                    userId: user.id
                })
            });

            if (response.ok) {
                setNewNote({ title: '', content: '' });
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando nota:', error);
        }
    };

    const createQuickProject = async () => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Sin nombre',
                    description: '',
                    userId: user.id
                })
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando proyecto:', error);
        }
    };

    const createQuickTask = async () => {
        // Buscar el primer proyecto disponible
        if (projects.length === 0) {
            alert('Primero debes crear un proyecto');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Sin nombre',
                    description: '',
                    projectId: projects[0].id,
                    priority: 'media',
                    userId: user.id
                })
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando tarea:', error);
        }
    };

    const createQuickTaskForProject = async (projectId) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Sin nombre',
                    description: '',
                    projectId: projectId,
                    priority: 'media',
                    userId: user.id
                })
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando tarea:', error);
        }
    };

    const createQuickNote = async () => {
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Nueva nota',
                    content: 'Escribe aquí...',
                    userId: user.id
                })
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando nota:', error);
        }
    };

    const updateProjectField = (projectId, field, value) => {
        setProjects(prev => prev.map(project => 
            project.id === projectId ? { ...project, [field]: value } : project
        ));
    };

    const updateTaskField = (taskId, field, value) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, [field]: value } : task
        ));
    };

    const saveProject = async (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        try {
            await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: projectId,
                    name: project.name,
                    description: project.description
                })
            });
        } catch (error) {
            console.log('Error guardando proyecto:', error);
        }
    };

    const saveTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: taskId,
                    title: task.title,
                    description: task.description,
                    priority: task.priority
                })
            });
        } catch (error) {
            console.log('Error guardando tarea:', error);
        }
    };

    const deleteProject = async (projectId) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto y todas sus tareas?')) return;

        try {
            await fetch(`/api/projects?id=${projectId}`, {
                method: 'DELETE'
            });
            loadData(user.id);
        } catch (error) {
            console.log('Error eliminando proyecto:', error);
        }
    };

    const updateNoteField = (noteId, field, value) => {
        setNotes(prev => prev.map(note => 
            note.id === noteId ? { ...note, [field]: value } : note
        ));
    };

    const saveNote = async (noteId) => {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;

        try {
            await fetch('/api/notes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: noteId,
                    title: note.title,
                    content: note.content
                })
            });
        } catch (error) {
            console.log('Error guardando nota:', error);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: taskId,
                    status: newStatus
                })
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error actualizando tarea:', error);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            const response = await fetch(`/api/notes?id=${noteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error eliminando nota:', error);
        }
    };

    const setMainTask = (task) => {
        setTodayTask(task);
        if (task.status === 'pendiente') {
            updateTaskStatus(task.id, 'en_proceso');
        }
    };

    if (!user) return <div>Cargando...</div>;

    return (
        <div className='min-h-screen bg-gradient-radial from-[#ff5757] to-[#9e005d] flex'>
            {/* Main Content - 75% */}
            <div className='flex-1 p-6'>
                <div className='max-w-4xl mx-auto'>
                    <h1 className='text-5xl font-black text-black text-center mb-8 font-bebas-neue tracking-wider flex items-center justify-center gap-3'>
                        <i className="fas fa-bullseye text-6xl"></i>
                        Enfoque de hoy
                    </h1>

                    {/* Tarea del Día */}
                    <div className='bg-black/20 backdrop-blur-sm rounded-2xl p-8 mb-8 min-h-[400px] flex flex-col justify-center items-center text-center'>
                        {todayTask ? (
                            <div>
                                <h2 className='text-4xl font-bebas-neue tracking-wide text-black mb-4'>
                                    {todayTask.title}
                                </h2>
                                <p className='text-lg text-black/80 mb-6'>
                                    {todayTask.description || 'Sin descripción'}
                                </p>
                                <p className='text-sm text-black/60 mb-6'>
                                    Proyecto: {todayTask.project_name}
                                </p>
                                <div className='flex gap-4 justify-center'>
                                    <button
                                        onClick={() => updateTaskStatus(todayTask.id, 'completada')}
                                        className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold flex items-center gap-2'
                                    >
                                        <i className="fas fa-check"></i>
                                        Completar
                                    </button>
                                    <button
                                        onClick={() => setTodayTask(null)}
                                        className='bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-bold flex items-center gap-2'
                                    >
                                        <i className="fas fa-sync"></i>
                                        Cambiar tarea
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className='text-3xl font-bebas-neue tracking-wide text-black mb-4'>
                                    Selecciona tu enfoque de hoy
                                </h2>
                                <p className='text-black/80 mb-6'>
                                    Elige una tarea para concentrarte
                                </p>
                                <div className='flex items-center gap-2 text-red-600'>
                                    <i className="fas fa-arrow-down text-2xl"></i>
                                    <span className='font-bold'>Haz click en una tarea de abajo</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Datatable - Proyectos y Tareas */}
                    <div className='bg-white/15 backdrop-blur-sm rounded-xl p-6 mb-4 shadow-lg'>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='text-3xl font-bebas-neue tracking-wide text-black flex items-center gap-3'>
                                <i className="fas fa-list text-2xl"></i>
                                Proyectos y tareas
                            </h3>
                            <div className='flex gap-3'>
                                <button
                                    onClick={createQuickProject}
                                    className='bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md'
                                    title="Nuevo Proyecto"
                                >
                                    <i className="fas fa-folder-plus text-lg"></i>
                                </button>
                            </div>
                        </div>

                        <div className='overflow-x-auto max-h-[500px] overflow-y-auto bg-white/10 rounded-lg'>
                            <table className='w-full text-base font-bebas-neue'>
                                <thead className='bg-red-900/30 sticky top-0'>
                                    <tr>
                                        <th className='text-left p-4 text-black font-bold tracking-wide'>Tipo</th>
                                        <th className='text-left p-4 text-black font-bold tracking-wide'>Nombre</th>
                                        <th className='text-left p-4 text-black font-bold tracking-wide'>Descripción</th>
                                        <th className='text-left p-4 text-black font-bold tracking-wide'>Estado</th>
                                        <th className='text-left p-4 text-black font-bold tracking-wide'>Info</th>
                                        <th className='text-left p-4 text-black font-bold tracking-wide'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => {
                                        const projectTasks = tasks.filter(task => task.project_id === project.id);
                                        const completedTasks = projectTasks.filter(task => task.status === 'completada');
                                        const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;
                                        
                                        return [
                                            <tr key={`project-${project.id}`} className='bg-red-600/25 border-b border-red-600/40 hover:bg-red-600/30 transition-all'>
                                                <td className='p-4'>
                                                    <span className='bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 w-fit'>
                                                        <i className="fas fa-folder"></i>
                                                        Proyecto
                                                    </span>
                                                </td>
                                                <td className='p-4'>
                                                    <input
                                                        type="text"
                                                        value={project.name}
                                                        onChange={(e) => updateProjectField(project.id, 'name', e.target.value)}
                                                        onBlur={() => saveProject(project.id)}
                                                        className='bg-transparent text-black font-bold border-none outline-none w-full text-lg placeholder-black/50'
                                                    />
                                                </td>
                                                <td className='p-4'>
                                                    <input
                                                        type="text"
                                                        value={project.description || ''}
                                                        onChange={(e) => updateProjectField(project.id, 'description', e.target.value)}
                                                        onBlur={() => saveProject(project.id)}
                                                        className='bg-transparent text-black/80 border-none outline-none w-full placeholder-black/40'
                                                        placeholder="Sin descripción"
                                                    />
                                                </td>
                                                <td className='p-4'>
                                                    <div className='bg-black/30 rounded-full h-3 w-24'>
                                                        <div 
                                                            className='bg-red-600 h-3 rounded-full transition-all duration-300'
                                                            style={{width: `${progress}%`}}
                                                        ></div>
                                                    </div>
                                                    <span className='text-sm text-black/70 font-bold'>{Math.round(progress)}%</span>
                                                </td>
                                                <td className='p-4'>
                                                    <span className='text-sm text-black/70 font-bold'>{projectTasks.length} tareas</span>
                                                </td>
                                                <td className='p-4'>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => createQuickTaskForProject(project.id)}
                                                            className='text-green-600 hover:text-green-800 p-1'
                                                            title="Nueva tarea"
                                                        >
                                                            <i className="fas fa-plus-circle text-xl"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProject(project.id)}
                                                            className='text-red-600 hover:text-red-800 p-1'
                                                            title="Eliminar proyecto"
                                                        >
                                                            <i className="fas fa-trash text-lg"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>,
                                            ...projectTasks.map(task => (
                                                <tr key={`task-${task.id}`} className='bg-white/15 border-b border-white/30 hover:bg-white/25 cursor-pointer transition-all' onClick={() => setMainTask(task)}>
                                                    <td className='p-4 pl-8'>
                                                        <span className='bg-red-800 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 w-fit'>
                                                            <i className="fas fa-tasks"></i>
                                                            Tarea
                                                        </span>
                                                    </td>
                                                    <td className='p-4'>
                                                        <input
                                                            type="text"
                                                            value={task.title}
                                                            onChange={(e) => updateTaskField(task.id, 'title', e.target.value)}
                                                            onBlur={() => saveTask(task.id)}
                                                            className='bg-transparent text-black font-semibold border-none outline-none w-full text-lg placeholder-black/50'
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className='p-4'>
                                                        <input
                                                            type="text"
                                                            value={task.description || ''}
                                                            onChange={(e) => updateTaskField(task.id, 'description', e.target.value)}
                                                            onBlur={() => saveTask(task.id)}
                                                            className='bg-transparent text-black/80 border-none outline-none w-full placeholder-black/40'
                                                            placeholder="Sin descripción"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </td>
                                                    <td className='p-4' onClick={(e) => e.stopPropagation()}>
                                                        <div className="relative">
                                                            <select
                                                                value={task.status}
                                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                                className={`appearance-none px-3 py-2 rounded-lg text-sm font-bold text-white cursor-pointer border-none outline-none ${
                                                                    task.status === 'completada' ? 'bg-green-600' : 
                                                                    task.status === 'en_proceso' ? 'bg-yellow-600' : 'bg-gray-600'
                                                                }`}
                                                            >
                                                                <option value="pendiente">Pendiente</option>
                                                                <option value="en_proceso">En proceso</option>
                                                                <option value="completada">Completada</option>
                                                            </select>
                                                            <i className="fas fa-chevron-down absolute right-2 top-3 text-white text-xs pointer-events-none"></i>
                                                        </div>
                                                    </td>
                                                    <td className='p-4' onClick={(e) => e.stopPropagation()}>
                                                        <div className="relative">
                                                            <select
                                                                value={task.priority}
                                                                onChange={(e) => updateTaskField(task.id, 'priority', e.target.value)}
                                                                onBlur={() => saveTask(task.id)}
                                                                className={`appearance-none px-3 py-2 rounded-lg text-sm font-bold text-white cursor-pointer border-none outline-none ${
                                                                    task.priority === 'alta' ? 'bg-red-600' : 
                                                                    task.priority === 'media' ? 'bg-orange-600' : 'bg-blue-600'
                                                                }`}
                                                            >
                                                                <option value="baja">Baja</option>
                                                                <option value="media">Media</option>
                                                                <option value="alta">Alta</option>
                                                            </select>
                                                            <i className="fas fa-chevron-down absolute right-2 top-3 text-white text-xs pointer-events-none"></i>
                                                        </div>
                                                    </td>
                                                    <td className='p-4'>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteTask(task.id);
                                                            }}
                                                            className='text-red-600 hover:text-red-800 p-1'
                                                            title="Eliminar tarea"
                                                        >
                                                            <i className="fas fa-trash text-lg"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ];
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Notas - 25% */}
            <div className='w-1/4 bg-black/10 backdrop-blur-sm p-4 border-l border-black/20'>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-2xl font-bebas-neue tracking-wide text-black flex items-center gap-2'>
                        <i className="fas fa-sticky-note text-xl"></i>
                        Notas rápidas
                    </h3>
                    <button
                        onClick={createQuickNote}
                        className='bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 shadow-md'
                        title="Nueva nota"
                    >
                        <i className="fas fa-plus text-lg"></i>
                    </button>
                </div>

                {/* Lista de Notas Post-it */}
                <div className='space-y-3 overflow-y-auto max-h-96'>
                    {notes.map((note, index) => {
                        const postItColors = [
                            'bg-yellow-200 border-yellow-300',
                            'bg-pink-200 border-pink-300', 
                            'bg-blue-200 border-blue-300',
                            'bg-green-200 border-green-300',
                            'bg-orange-200 border-orange-300'
                        ];
                        const colorClass = postItColors[index % postItColors.length];
                        
                        return (
                            <div key={note.id} className={`${colorClass} p-4 rounded-lg border-2 shadow-md transform hover:rotate-1 transition-all duration-200 relative`}>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md'
                                    title="Eliminar nota"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                                
                                <input
                                    type="text"
                                    value={note.title}
                                    onChange={(e) => updateNoteField(note.id, 'title', e.target.value)}
                                    onBlur={() => saveNote(note.id)}
                                    className='bg-transparent text-black font-bold border-none outline-none w-full text-lg placeholder-black/50 mb-2'
                                    placeholder="Título"
                                />
                                
                                <textarea
                                    value={note.content}
                                    onChange={(e) => updateNoteField(note.id, 'content', e.target.value)}
                                    onBlur={() => saveNote(note.id)}
                                    className='bg-transparent text-black/80 border-none outline-none w-full resize-none placeholder-black/40'
                                    placeholder="Contenido..."
                                    rows="3"
                                />
                                
                                <div className='flex justify-end mt-2'>
                                    <i className="fas fa-thumbtack text-gray-600 text-sm"></i>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;