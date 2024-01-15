import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "./TodoApp.scss";

const firebaseConfig = {
  apiKey: "AIzaSyAQG314Jk6128XXw7bt3bmdSyPRTLa83CI",
  authDomain: "todolist-7b338.firebaseapp.com",
  projectId: "todolist-7b338",
  storageBucket: "todolist-7b338.appspot.com",
  messagingSenderId: "736010293721",
  appId: "1:736010293721:web:1dc0cf092e2118661509c8",
  measurementId: "G-LDP0Q5JKC7",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [db]);

  const addTask = async () => {
    if (newTask.trim() !== "") {
      await addDoc(collection(db, "tasks"), {
        task: newTask,
        completed: false,
      });
      setNewTask("");
    }
  };

  const toggleTask = async (taskId, completed) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { completed: !completed });
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div>
        <input type="text" placeholder="Add a new task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, task.completed)} />
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.task}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
