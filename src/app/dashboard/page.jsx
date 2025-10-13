"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [todaysFocus, setTodaysFocus] = useState('');
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedType, setDraggedType] = useState(null);
    
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
        
        // Iniciar animación de bienvenida
        setTimeout(() => {
            setIsAnimationComplete(true);
        }, 2000);
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
        <div className='min-h-screen bg-[#faf8f5]'>
            {/* Mensaje de Bienvenida - Animación Práctica 7 */}
            <h1 
                className={`text-[#2c2c2c] font-semibold text-center mb-12 transition-all duration-[600ms] ease-out ${
                    isAnimationComplete 
                    ? 'text-4xl transform translate-y-0 scale-100' 
                    : 'text-7xl transform translate-y-[40vh] scale-150'
                }`}
                style={{
                    fontFamily: 'Bebas Neue, cursive'
                }}
            >
                ¡Bienvenido, {user?.name || 'Usuario'}!
            </h1>

            {/* Layout Principal - Práctica 7 */}
            <div className={`flex gap-8 max-w-7xl mx-auto px-6 transition-opacity duration-[600ms] delay-[1700ms] ${
                isAnimationComplete ? 'opacity-100' : 'opacity-0'
            }`}>
                {/* Contenido Principal */}
                <div className='flex-1'>
                    {/* Enfoque de Hoy - Reemplaza el formulario de tareas */}
                    <div className={`bg-white p-6 rounded-lg shadow-lg mb-8 border border-[#e5e5e5] transition-all duration-[600ms] delay-[1700ms] ${
                        isAnimationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        <h2 className='text-[#2c2c2c] font-semibold mb-4 text-xl'>
                            Enfoque de hoy
                        </h2>
                        <div className='min-h-[200px] flex items-center justify-center'>
                            {todaysFocus ? (
                                <div className='text-center'>
                                    <h3 className='text-3xl font-medium text-[#2c2c2c] mb-4'>
                                        {todaysFocus}
                                    </h3>
                                    <button
                                        onClick={() => setTodaysFocus('')}
                                        className='bg-[#2c2c2c] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-300 font-medium'
                                    >
                                        Cambiar Enfoque
                                    </button>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <h3 className='text-2xl font-medium text-[#666] mb-4'>
                                        Define tu enfoque del día
                                    </h3>
                                    <input
                                        type="text"
                                        value={todaysFocus}
                                        onChange={(e) => setTodaysFocus(e.target.value)}
                                        placeholder="¿En qué te vas a enfocar hoy?"
                                        className='w-full max-w-md px-4 py-3 border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#2c2c2c] transition-all duration-300 text-center'
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabla Principal - Estilo Práctica 7 */}
                    <div className={`bg-white rounded-lg shadow-lg overflow-hidden border border-[#e5e5e5] mb-4 transition-all duration-[600ms] delay-[1900ms] ${
                        isAnimationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-base'>
                                <thead>
                                    <tr className='bg-[#f8f9fa] border-b border-[#e5e5e5]'>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/4'>Título</th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/3'>Descripción</th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/6'>Estado</th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/6'>Prioridad</th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/12'>Vencimiento</th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/12'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => {
                                        const projectTasks = tasks.filter(task => task.project_id === project.id);
                                        
                                        return [
                                            <tr key={`project-${project.id}`} className='bg-[#e9ecef] border-b border-[#e5e5e5]'>
                                                <td colSpan="5" className='p-4'>
                                                    <input
                                                        type="text"
                                                        value={project.name}
                                                        onChange={(e) => updateProjectField(project.id, 'name', e.target.value)}
                                                        onBlur={() => saveProject(project.id)}
                                                        className='bg-transparent font-semibold text-[#2c2c2c] border-none outline-none w-full text-base'
                                                    />
                                                </td>
                                                <td className='p-4'>
                                                    <button
                                                        onClick={() => deleteProject(project.id)}
                                                        className='text-red-600 hover:text-red-800 transition-colors duration-300'
                                                        title="Eliminar proyecto"
                                                    >
                                                        <i className="fas fa-folder-minus"></i>
                                                    </button>
                                                </td>
                                            </tr>,
                                            ...projectTasks.map(task => (
                                                <tr key={`task-${task.id}`} className='border-b border-[#e5e5e5] hover:bg-[#f8f9fa] transition-colors duration-300'>
                                                    <td className='p-4'>
                                                        <input
                                                            type="text"
                                                            value={task.title}
                                                            onChange={(e) => updateTaskField(task.id, 'title', e.target.value)}
                                                            onBlur={() => saveTask(task.id)}
                                                            className='bg-transparent text-[#2c2c2c] border-none outline-none w-full text-base font-medium'
                                                        />
                                                    </td>
                                                    <td className='p-4'>
                                                        <input
                                                            type="text"
                                                            value={task.description || ''}
                                                            onChange={(e) => updateTaskField(task.id, 'description', e.target.value)}
                                                            onBlur={() => saveTask(task.id)}
                                                            className='bg-transparent text-[#666] border-none outline-none w-full text-base'
                                                            placeholder="Sin descripción"
                                                        />
                                                    </td>
                                                    <td className='p-4'>
                                                        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                            task.status === 'completada' ? 'bg-green-100 text-green-800' : 
                                                            task.status === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' : 
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {task.status === 'completada' ? 'Hecha' : 
                                                             task.status === 'en_proceso' ? 'En Proceso' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td className='p-4'>
                                                        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                            task.priority === 'alta' ? 'bg-red-100 text-red-800' : 
                                                            task.priority === 'media' ? 'bg-orange-100 text-orange-800' : 
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {task.priority === 'alta' ? 'Alta' : 
                                                             task.priority === 'media' ? 'Media' : 'Baja'}
                                                        </span>
                                                    </td>
                                                    <td className='p-4 text-[#666] text-base'>
                                                        {task.due_date || '-'}
                                                    </td>
                                                    <td className='p-4'>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className='text-red-600 hover:text-red-800 transition-colors duration-300'
                                                            title="Eliminar tarea"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ];
                                    })}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className='text-center text-[#666] p-8'>
                                                No hay proyectos creados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Botón Crear Proyecto */}
                    <button
                        onClick={createQuickProject}
                        className={`w-full bg-transparent border-2 border-[#e5e5e5] text-[#2c2c2c] py-3 rounded-lg hover:bg-[#f8f9fa] transition-all duration-[600ms] font-medium mb-4 delay-[2100ms] ${
                            isAnimationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                        }`}
                    >
                        <i className="fas fa-plus mr-2"></i>Crear Proyecto
                    </button>
                </div>

                {/* Sidebar Notas - Estilo Práctica 7 */}
                <div className={`w-80 flex-shrink-0 transition-all duration-[600ms] delay-[2100ms] ${
                    isAnimationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}>
                    <h3 className='text-[#2c2c2c] font-semibold mb-4 pb-2 border-b border-[#e5e5e5]'>
                        Notas
                    </h3>
                    
                    {/* Botón Crear Nota */}
                    <button
                        onClick={createQuickNote}
                        className='inline-flex items-center text-[#2c2c2c] font-medium py-2 px-4 rounded-lg hover:bg-[#f8f9fa] transition-all duration-300 mb-4 border border-[#e5e5e5]'
                    >
                        <i className="fas fa-sticky-note mr-2"></i>Crear Nota
                    </button>

                    {/* Lista de Notas Post-it */}
                    <div className='space-y-3 overflow-y-auto max-h-96'>
                        {notes.map((note, index) => {
                            const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[0.5deg]'];
                            const rotation = rotations[index % rotations.length];
                            
                            return (
                                <div key={note.id} className={`bg-[#f8f9fa] border border-[#e5e5e5] p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative transform ${rotation} hover:rotate-0 hover:scale-102 min-h-[140px]`}>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-300'
                                        title="Eliminar nota"
                                    >
                                        ×
                                    </button>
                                    
                                    <input
                                        type="text"
                                        value={note.title}
                                        onChange={(e) => updateNoteField(note.id, 'title', e.target.value)}
                                        onBlur={() => saveNote(note.id)}
                                        className='bg-transparent text-[#2c2c2c] font-semibold border-none outline-none w-full text-sm placeholder-[#666] mb-2'
                                        placeholder="Título de la nota"
                                    />
                                    
                                    <textarea
                                        value={note.content}
                                        onChange={(e) => updateNoteField(note.id, 'content', e.target.value)}
                                        onBlur={() => saveNote(note.id)}
                                        className='bg-transparent text-[#2c2c2c] border-none outline-none w-full resize-none placeholder-[#666] text-xs leading-relaxed'
                                        placeholder="Escribe tu nota aquí..."
                                        rows="4"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Botón Cerrar Sesión - Estilo Práctica 7 */}
            <div className='fixed bottom-4 left-4'>
                <button
                    onClick={() => {
                        localStorage.removeItem('currentUser');
                        router.push('/login');
                    }}
                    className='text-[#666] hover:text-[#2c2c2c] transition-colors duration-300 text-sm'
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default Dashboard;