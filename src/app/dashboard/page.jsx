"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/hooks/useAuth';
import CalendarComponent from '@/components/CalendarComponent';

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

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks?id=${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error eliminando tarea:', error);
        }
    };

    const createTask = async (projectId) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Sin nombre',
                    description: '',
                    status: 'pendiente',
                    projectId: projectId,
                    userId: user.id,
                    due_date: new Date().toISOString().split('T')[0]
                })
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando tarea:', error);
        }
    };

    const updateProject = async (projectId, updates) => {
        try {
            const response = await fetch(`/api/projects?id=${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error actualizando proyecto:', error);
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            const response = await fetch(`/api/tasks?id=${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error actualizando tarea:', error);
        }
    };

    const updateNote = async (noteId, updates) => {
        try {
            const response = await fetch(`/api/notes?id=${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error actualizando nota:', error);
        }
    };

    // Funciones de Drag and Drop
    const handleDragStart = (e, item, type) => {
        setDraggedItem(item);
        setDraggedType(type);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetItem, targetType) => {
        e.preventDefault();
        
        if (!draggedItem || !draggedType) return;

        // Tareas solo se pueden mover entre proyectos o reordenar dentro del mismo proyecto
        if (draggedType === 'task' && targetType === 'project') {
            if (draggedItem.project_id !== targetItem.id) {
                // Mover tarea a otro proyecto
                updateTask(draggedItem.id, { project_id: targetItem.id });
            }
        } else if (draggedType === 'task' && targetType === 'task') {
            // Reordenar tareas dentro del mismo proyecto
            if (draggedItem.project_id === targetItem.project_id) {
                reorderTasks(draggedItem, targetItem);
            }
        } else if (draggedType === 'project' && targetType === 'project') {
            // Reordenar proyectos
            reorderProjects(draggedItem, targetItem);
        } else if (draggedType === 'note' && targetType === 'note') {
            // Reordenar notas
            reorderNotes(draggedItem, targetItem);
        }
        
        // Reset del estado de drag
        setDraggedItem(null);
        setDraggedType(null);
    };

    const reorderTasks = (draggedTask, targetTask) => {
        const projectTasks = tasks.filter(t => t.project_id === draggedTask.project_id);
        const draggedIndex = projectTasks.findIndex(t => t.id === draggedTask.id);
        const targetIndex = projectTasks.findIndex(t => t.id === targetTask.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const reorderedTasks = [...projectTasks];
            const [removed] = reorderedTasks.splice(draggedIndex, 1);
            reorderedTasks.splice(targetIndex, 0, removed);
            
            // Actualizar el orden en el estado local
            const updatedTasks = tasks.map(task => {
                if (task.project_id === draggedTask.project_id) {
                    const newIndex = reorderedTasks.findIndex(t => t.id === task.id);
                    return { ...task, order_position: newIndex };
                }
                return task;
            });
            
            setTasks(updatedTasks);
        }
    };

    const reorderProjects = (draggedProject, targetProject) => {
        const draggedIndex = projects.findIndex(p => p.id === draggedProject.id);
        const targetIndex = projects.findIndex(p => p.id === targetProject.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const reorderedProjects = [...projects];
            const [removed] = reorderedProjects.splice(draggedIndex, 1);
            reorderedProjects.splice(targetIndex, 0, removed);
            
            setProjects(reorderedProjects);
        }
    };

    const reorderNotes = (draggedNote, targetNote) => {
        const draggedIndex = notes.findIndex(n => n.id === draggedNote.id);
        const targetIndex = notes.findIndex(n => n.id === targetNote.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const reorderedNotes = [...notes];
            const [removed] = reorderedNotes.splice(draggedIndex, 1);
            reorderedNotes.splice(targetIndex, 0, removed);
            
            setNotes(reorderedNotes);
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDraggedType(null);
    };

    const setMainTask = (task) => {
        setTodayTask(task);
        if (task.status === 'pendiente') {
            updateTaskStatus(task.id, 'en_proceso');
        }
    };

    if (!user) return <div>Cargando...</div>;

    return (
        <div className='min-h-screen bg-[#faf8f5] overflow-hidden'>
            {/* Contenedor principal con mejor espaciado */}
            <div className='pt-16 px-6'>
                {/* Mensaje de Bienvenida*/}
                <h1 
                    className={`text-[#2c2c2c] font-semibold text-center mb-12 transition-all duration-[600ms] ease-out ${
                        isAnimationComplete 
                        ? 'text-4xl transform translate-y-0 scale-100' 
                        : 'text-7xl transform translate-y-[40vh] scale-150'
                    }`}
                >
                    Bienvenido, {user?.name || 'Usuario'}
                </h1>

                {/* Layout Principal */}
                <div className={`flex gap-8 max-w-7xl mx-auto transition-opacity duration-[600ms] delay-[1700ms] ${
                    isAnimationComplete ? 'opacity-100' : 'opacity-0'
                }`}>
                {/* Contenido Principal */}
                <div className='flex-1'>
                    {/* Enfoque de Hoy*/}
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
                                        className='bg-[#2c2c2c] text-white px-6 py-2 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 font-medium'
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

                    {/* Tabla Principal  */}
                    <div className={`bg-white rounded-xl shadow-xl border border-[#e5e5e5] mb-4 transition-all duration-[600ms] delay-[1900ms] overflow-hidden ${
                        isAnimationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}>
                        <div className='overflow-x-auto max-h-[500px] overflow-y-auto'>
                            <table className='w-full text-base'>
                                <thead className='sticky top-0 bg-white z-10'>
                                    <tr className='bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] border-b-2 border-[#e5e5e5]'>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/4'>
                                            <div className='flex items-center gap-2'>
                                                <i className="fas fa-tasks text-sm text-[#666]"></i>
                                                Título
                                            </div>
                                        </th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/3'>
                                            <div className='flex items-center gap-2'>
                                                <i className="fas fa-align-left text-sm text-[#666]"></i>
                                                Descripción
                                            </div>
                                        </th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/6'>
                                            <div className='flex items-center gap-2'>
                                                <i className="fas fa-circle-notch text-sm text-[#666]"></i>
                                                Estado
                                            </div>
                                        </th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/6'>
                                            <div className='flex items-center gap-2'>
                                                <i className="fas fa-flag text-sm text-[#666]"></i>
                                                Prioridad
                                            </div>
                                        </th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/12'>
                                            <div className='flex items-center gap-2'>
                                                <i className="fas fa-calendar text-sm text-[#666]"></i>
                                                Vencimiento
                                            </div>
                                        </th>
                                        <th className='text-left p-4 font-semibold text-[#2c2c2c] w-1/12'>
                                            <div className='flex items-center gap-2'>
                                                <i className="fas fa-cog text-sm text-[#666]"></i>
                                                Acción
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => {
                                        const projectTasks = tasks.filter(task => task.project_id === project.id);
                                        
                                        return [
                                            <tr 
                                                key={`project-${project.id}`} 
                                                className='bg-[#f8f9fa] border-b-2 border-[#e5e5e5] hover:bg-[#f1f3f4] transition-all duration-300 cursor-move'
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, project, 'project')}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, project, 'project')}
                                            >
                                                <td colSpan="5" className='p-4'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='w-8 h-8 bg-[#2c2c2c] rounded-lg flex items-center justify-center'>
                                                            <i className="fas fa-folder text-white text-sm"></i>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={project.name}
                                                            onChange={(e) => updateProjectField(project.id, 'name', e.target.value)}
                                                            onBlur={() => saveProject(project.id)}
                                                            className='bg-transparent font-bold text-[#2c2c2c] border-none outline-none flex-1 text-lg'
                                                            placeholder="Nombre del proyecto"
                                                        />
                                                    </div>
                                                </td>
                                                <td className='p-4'>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => createTask(project.id)}
                                                            className='w-8 h-8 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-md'
                                                            title="Añadir tarea"
                                                        >
                                                            <i className="fas fa-plus text-sm"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProject(project.id)}
                                                            className='w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-md'
                                                            title="Eliminar proyecto"
                                                        >
                                                            <i className="fas fa-trash text-sm"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>,
                                            ...projectTasks.map(task => (
                                                <tr 
                                                    key={`task-${task.id}`} 
                                                    className='border-b border-[#f0f0f0] hover:bg-[#fafbfc] transition-all duration-300 group cursor-move'
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, task, 'task')}
                                                    onDragEnd={handleDragEnd}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, task, 'task')}
                                                >
                                                    <td className='p-4 pl-12'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className={`w-3 h-3 rounded-full ${
                                                                task.status === 'completada' ? 'bg-green-500' : 
                                                                task.status === 'en_proceso' ? 'bg-yellow-500' : 'bg-gray-400'
                                                            }`}></div>
                                                            <input
                                                                type="text"
                                                                value={task.title}
                                                                onChange={(e) => updateTaskField(task.id, 'title', e.target.value)}
                                                                onBlur={() => saveTask(task.id)}
                                                                className='bg-transparent text-[#2c2c2c] border-none outline-none flex-1 text-base font-medium'
                                                                placeholder="Nombre de la tarea"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className='p-4'>
                                                        <input
                                                            type="text"
                                                            value={task.description || ''}
                                                            onChange={(e) => updateTaskField(task.id, 'description', e.target.value)}
                                                            onBlur={() => saveTask(task.id)}
                                                            className='bg-transparent text-[#666] border-none outline-none w-full text-base'
                                                            placeholder="Descripción..."
                                                        />
                                                    </td>
                                                    <td className='p-4'>
                                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${
                                                            task.status === 'completada' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                            task.status === 'en_proceso' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                            'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}>
                                                            <i className={`fas text-xs ${
                                                                task.status === 'completada' ? 'fa-check' : 
                                                                task.status === 'en_proceso' ? 'fa-clock' : 'fa-pause'
                                                            }`}></i>
                                                            {task.status === 'completada' ? 'Completada' : 
                                                             task.status === 'en_proceso' ? 'En Proceso' : 'Pendiente'}
                                                        </div>
                                                    </td>
                                                    <td className='p-4'>
                                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${
                                                            task.priority === 'alta' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                            task.priority === 'media' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                                            'bg-blue-50 text-blue-700 border-blue-200'
                                                        }`}>
                                                            <i className={`fas text-xs ${
                                                                task.priority === 'alta' ? 'fa-exclamation' : 
                                                                task.priority === 'media' ? 'fa-minus' : 'fa-arrow-down'
                                                            }`}></i>
                                                            {task.priority === 'alta' ? 'Alta' : 
                                                             task.priority === 'media' ? 'Media' : 'Baja'}
                                                        </div>
                                                    </td>
                                                    <td className='p-4 text-[#666] text-base'>
                                                        <div className='w-48'>
                                                            <CalendarComponent
                                                                selectedDate={task.due_date ? new Date(task.due_date) : null}
                                                                onDateSelect={(date) => updateTask(task.id, { due_date: date.toISOString().split('T')[0] })}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className='p-4'>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className='w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'
                                                            title="Eliminar tarea"
                                                        >
                                                            <i className="fas fa-trash text-sm"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ];
                                    })}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className='text-center p-16'>
                                                <div className='flex flex-col items-center gap-4'>
                                                    <div className='w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center'>
                                                        <i className="fas fa-folder-plus text-2xl text-[#666]"></i>
                                                    </div>
                                                    <div>
                                                        <h3 className='text-lg font-semibold text-[#2c2c2c] mb-2'>No hay proyectos aún</h3>
                                                        <p className='text-[#666] text-base'>Crea tu primer proyecto para comenzar a organizar tus tareas</p>
                                                    </div>
                                                </div>
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
                        className={`w-full bg-gradient-to-r from-[#2c2c2c] to-[#404040] hover:from-[#1a1a1a] hover:to-[#2c2c2c] text-white py-4 rounded-xl font-medium mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] delay-[2100ms] ${
                            isAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        <div className='flex items-center justify-center gap-3'>
                            <span className='text-xl font-bold'>+</span>
                            Crear Nuevo Proyecto
                        </div>
                    </button>
                </div>

                {/* Sidebar Notas*/}
                <div className={`w-96 flex-shrink-0 transition-all duration-[600ms] delay-[2100ms] ${
                    isAnimationComplete ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}>
                    <h3 className='text-[#2c2c2c] font-semibold mb-4 pb-2 border-b border-[#e5e5e5]'>
                        Notas
                    </h3>
                    
                    {/* Botón Crear Nota */}
                    <button
                        onClick={createQuickNote}
                        className='inline-flex items-center bg-[#2c2c2c] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1a1a1a] transition-all duration-300 mb-4'
                    >
                        <i className="fas fa-sticky-note mr-2"></i>Crear Nota
                    </button>

                    {/* Lista de Notas Post-it */}
                    <div className='space-y-3 overflow-y-auto max-h-[600px] pr-2 pb-4'>
                        {notes.map((note, index) => {
                            const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[0.5deg]'];
                            const rotation = rotations[index % rotations.length];
                            
                            return (
                                <div 
                                    key={note.id} 
                                    className={`bg-[#f8f9fa] border border-[#e5e5e5] p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative transform ${rotation} hover:rotate-0 hover:scale-102 min-h-[140px] group cursor-move`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, note, 'note')}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, note, 'note')}
                                >
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className='absolute top-2 right-2 text-red-400 hover:text-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 text-sm'
                                        title="Eliminar nota"
                                    >
                                        <i className="fas fa-trash"></i>
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

                {/* Botón Cerrar Sesión - Esquina Superior Derecha */}
                <div className='fixed top-4 right-4'>
                    <button
                        onClick={() => {
                            localStorage.removeItem('currentUser');
                            router.push('/login');
                        }}
                        className='bg-[#2c2c2c] border border-[#2c2c2c] text-white hover:bg-[#1a1a1a] px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md'
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default withAuth(Dashboard);