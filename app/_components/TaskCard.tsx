'use client';

import { Task } from '@/types';
import { useState } from 'react';

type TaskCardProps = {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const handleStatusToggle = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    onUpdate({ ...task, status: newStatus });
  };

  const handleSave = () => {
    onUpdate({
      ...task,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-black"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-black"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm text-white bg-violet-600 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600">{task.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={handleStatusToggle}
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
            </div>
          </div>
          {task.dueDate && (
            <p className="mt-2 text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-violet-600 hover:text-violet-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}