import React, { useState, useEffect } from "react";

export const TodoListFetch = () => {
    const host = 'https://playground.4geeks.com/todo';
    const user = 'sarto';
    //AGREGAR TAREA
    const [newTask, setNewTask] = useState('');
    //EDITAR TAREA
    const [editTask, setEditTask] = useState('');
    //DECIR SI ESTA COMPLETA
    const [isDone, setIsDone] = useState(false);
    //LISTA DE TAREAS
    const [todos, setTodos] = useState([]);
    //CONDICION DE PANTALLAS 
    const [isEditing, setIsEditing] = useState(false);
    //ELIMINAR TAREAS A TRAVES DEL ID
    const [editId, setEditId] = useState(null);


    // Obtener tareas
    const getTodos = async () => {
        const uri = `${host}/users/${user}`;
        const options = {
            method: 'GET'
        }
        const response = await fetch(uri, options);

        if (!response.ok) {
            console.error('Error', response.status, response.statusText);
            return;
        }
        const data = await response.json();
        setTodos(data.todos);
    };

    // Agregar tarea
    const addTodos = async (task) => {
        const dataToSend = { label: task, is_done: false };
        const uri = `${host}/todos/${user}`;
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        }
        const response = await fetch(uri, options);

        if (!response.ok) {
            console.error('Error', response.status, response.statusText);
            return;
        }
        getTodos();
        setNewTask(''); // Limpiar input
    };



    // Editar tarea
    const editTodo = async (task) => {
        const dataToSend = { label: task, is_done: isDone };
        const uri = `${host}/todos/${editId}`;

        const response = await fetch(uri, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            console.error('Error', response.status, response.statusText);
            return;
        }

        getTodos();
        setIsEditing(false);
        setEditTask(''); // Limpiar input
    };


    // Eliminar tarea
    const deleteTodo = async (id) => {
        const uri = `${host}/todos/${id}`;
        const response = await fetch(uri, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.error('Error', response.status, response.statusText);
            return;
        }

        // Actualizar la lista después de eliminar
        getTodos();
    };

    // Manejar la eliminación directamente desde el botón
    const handleDelete = (id) => {
        deleteTodo(id);
    };



    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const trimmedTask = newTask.trim(); // Eliminar espacios en blanco

        if (trimmedTask !== "") {
            addTodos(trimmedTask); // Pasamos la tarea recortada
        }
    };




    const handleSubmitEdit = (event) => {
        event.preventDefault();
        const trimmedEditTask = editTask.trim(); // Eliminar espacios en blanco

        if (trimmedEditTask !== "") {
            editTodo(trimmedEditTask); // Pasamos la tarea recortada
        }
    };
    // Cargar tareas al inicio
    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center">Todo List with Fetch</h1>

            {/* Renderizado condicional */}
            {!isEditing ? (
                <form onSubmit={handleSubmitAdd}>
                    <label className="form-label">Nueva Tarea</label>
                    <input type="text" className="form-control"
                        onChange={event => setNewTask(event.target.value)}
                        value={newTask} />
                    <button type="submit" className="btn btn-success mt-2">Añadir Tarea</button>
                </form>
            ) : (
                <form onSubmit={handleSubmitEdit}>
                    <label className="form-label">Editar Tarea</label>
                    <input type="text" className="form-control"
                        onChange={event => setEditTask(event.target.value)}
                        value={editTask} />
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input"
                            onChange={event => setIsDone(event.target.checked)}
                            checked={isDone} />
                        <label className="form-check-label">Completado</label>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Guardas Cambios</button>
                    <button type="button" className="btn btn-secondary mt-2 mx-2" onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
            )}

            {/* Lista de tareas */}
            <ul className="list-group my-2">
                {todos.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {task.label} - {task.is_done ? 'Completed' : 'Pending'}
                        <div>
                            <button className="btn btn-warning btn-sm mx-1"
                                onClick={() => { setIsEditing(true); setEditTask(task.label); setEditId(task.id); setIsDone(task.is_done); }}>
                                Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => { handleDelete(task.id) }}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
