"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', priority: 'media' });
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    
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
            setTasks(tasksData.tasks || []);
            setNotes(notesData.notes || []);
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

    const createProject = async () => {
        if (!newProject.name.trim()) return;

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProject.name,
                    description: newProject.description,
                    userId: user.id
                })
            });

            if (response.ok) {
                setNewProject({ name: '', description: '' });
                setShowProjectModal(false);
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando proyecto:', error);
        }
    };

    const createTask = async () => {
        if (!newTask.title.trim() || !newTask.projectId) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    projectId: parseInt(newTask.projectId),
                    priority: newTask.priority,
                    userId: user.id
                })
            });

            if (response.ok) {
                setNewTask({ title: '', description: '', projectId: '', priority: 'media' });
                setShowTaskModal(false);
                loadData(user.id);
            }
        } catch (error) {
            console.log('Error creando tarea:', error);
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

    if (!user) return <div>Cargando...</div>;

    return (
        <div className='min-h-screen bg-gradient-radial from-[#ff5757] to-[#9e005d] p-6'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-black text-black text-center mb-8 font-impact'>
                    ¡Hola, {user.name}!
                </h1>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='bg-yellow-100 rounded-lg p-4'>
                        <h2 className='text-xl font-bold text-black mb-4'>📝 Notas Rápidas</h2>
                        
                        <div className='mb-4'>
                            <input
                                type="text"
                                placeholder="Título de la nota"
                                value={newNote.title}
                                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                                className='w-full p-2 rounded mb-2 text-black'
                            />
                            <textarea
                                placeholder="Contenido..."
                                value={newNote.content}
                                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                                className='w-full p-2 rounded mb-2 text-black'
                                rows="3"
                            />
                            <button
                                onClick={createNote}
                                className='w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600'
                            >
                                Crear Nota
                            </button>
                        </div>

                        <div className='space-y-2 max-h-96 overflow-y-auto'>
                            {notes.map(note => (
                                <div key={note.id} className='bg-yellow-200 p-3 rounded'>
                                    <h3 className='font-bold text-black'>{note.title}</h3>
                                    <p className='text-black text-sm'>{note.content}</p>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className='text-red-600 text-xs mt-1 hover:underline'
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='bg-blue-100 rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold text-black'>📂 Proyectos</h2>
                            <button
                                onClick={() => setShowProjectModal(true)}
                                className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
                            >
                                + Nuevo
                            </button>
                        </div>

                        <div className='space-y-3 max-h-96 overflow-y-auto'>
                            {projects.map(project => {
                                const projectTasks = tasks.filter(task => task.project_id === project.id);
                                const completedTasks = projectTasks.filter(task => task.status === 'completada');
                                const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;

                                return (
                                    <div key={project.id} className='bg-blue-200 p-3 rounded'>
                                        <h3 className='font-bold text-black'>{project.name}</h3>
                                        <p className='text-black text-sm'>{project.description}</p>
                                        <div className='mt-2'>
                                            <div className='bg-blue-300 rounded-full h-2'>
                                                <div 
                                                    className='bg-blue-600 h-2 rounded-full'
                                                    style={{width: `${progress}%`}}
                                                ></div>
                                            </div>
                                            <p className='text-xs text-black mt-1'>
                                                {completedTasks.length}/{projectTasks.length} tareas completadas
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='bg-green-100 rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-bold text-black'>✅ Tareas</h2>
                            <button
                                onClick={() => setShowTaskModal(true)}
                                className='bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600'
                            >
                                + Nueva
                            </button>
                        </div>

                        <div className='space-y-2 max-h-96 overflow-y-auto'>
                            {tasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className={`p-3 rounded ${
                                        task.status === 'completada' ? 'bg-green-300' : 
                                        task.status === 'en_proceso' ? 'bg-yellow-200' : 'bg-gray-200'
                                    }`}
                                >
                                    <h3 className='font-bold text-black'>{task.title}</h3>
                                    <p className='text-black text-sm'>{task.description}</p>
                                    <p className='text-xs text-gray-600'>Proyecto: {task.project_name}</p>
                                    <div className='mt-2 flex gap-1'>
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'pendiente')}
                                            className='text-xs bg-gray-500 text-white px-2 py-1 rounded'
                                        >
                                            Pendiente
                                        </button>
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'en_proceso')}
                                            className='text-xs bg-yellow-500 text-white px-2 py-1 rounded'
                                        >
                                            En Proceso
                                        </button>
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'completada')}
                                            className='text-xs bg-green-500 text-white px-2 py-1 rounded'
                                        >
                                            Completada
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showProjectModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-xl font-bold mb-4'>Nuevo Proyecto</h3>
                        <input
                            type="text"
                            placeholder="Nombre del proyecto"
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            className='w-full p-3 border rounded mb-3'
                        />
                        <textarea
                            placeholder="Descripción..."
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            className='w-full p-3 border rounded mb-4'
                            rows="3"
                        />
                        <div className='flex gap-2'>
                            <button
                                onClick={createProject}
                                className='flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => setShowProjectModal(false)}
                                className='flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600'
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTaskModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-xl font-bold mb-4'>Nueva Tarea</h3>
                        <input
                            type="text"
                            placeholder="Título de la tarea"
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            className='w-full p-3 border rounded mb-3'
                        />
                        <textarea
                            placeholder="Descripción..."
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            className='w-full p-3 border rounded mb-3'
                            rows="2"
                        />
                        <select
                            value={newTask.projectId}
                            onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                            className='w-full p-3 border rounded mb-3'
                        >
                            <option value="">Seleccionar proyecto</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                            className='w-full p-3 border rounded mb-4'
                        >
                            <option value="baja">Prioridad Baja</option>
                            <option value="media">Prioridad Media</option>
                            <option value="alta">Prioridad Alta</option>
                        </select>
                        <div className='flex gap-2'>
                            <button
                                onClick={createTask}
                                className='flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600'
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className='flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600'
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;