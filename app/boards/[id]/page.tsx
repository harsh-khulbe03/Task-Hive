"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../_components/Navbar";
import TaskCard from "../../_components/TaskCard";
import ProtectedRoute from "../../_components/ProtectedRoute";
import { Board, Task } from "@/types";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBoardAndTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch board
        const boardResponse = await fetch(`/api/boards/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!boardResponse.ok) {
          throw new Error("Failed to fetch board");
        }

        const boardData = await boardResponse.json();
        setBoard(boardData);

        // Fetch tasks
        const tasksResponse = await fetch(`/api/tasks?boardId=${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!tasksResponse.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardAndTasks();
  }, [params.id]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          boardId: params.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!board) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <p className="text-center py-12 text-gray-500">Board not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-gray-300"
            >
              Back to Boards
            </button>
          </div>

          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
              >
                Add Task
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-center py-12 text-gray-500">
                No tasks yet. Add your first task above.
              </p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
