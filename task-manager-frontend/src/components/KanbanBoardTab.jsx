// import React, { useState, useEffect } from 'react';
// import apiClient from '../services/api';
// import { DndContext, closestCorners } from '@dnd-kit/core';
// import KanbanColumn from './KanbanColumn';

// const KanbanBoardTab = ({ initialTasks, projectId, onUpdate }) => {
//   const [tasks, setTasks] = useState(initialTasks);
//   const [newTaskTitle, setNewTaskTitle] = useState('');

//   useEffect(() => {
//     setTasks(initialTasks);
//   }, [initialTasks]);

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (!over) {
//       return;
//     }

//     const activeId = active.id;
//     const overId = over.id;

//     const activeTask = tasks.find((t) => t.id === activeId);
//     if (!activeTask) return;
//     const activeContainer = activeTask.status;

//     let overContainer;
//     if (overId === 'TODO' || overId === 'IN_PROGRESS' || overId === 'DONE') {
//       overContainer = overId;
//     } else {
//       const overTask = tasks.find((t) => t.id === overId);
//       if (!overTask) return;
//       overContainer = overTask.status;
//     }

//     if (activeContainer === overContainer) {
//       return;
//     }
    
//     setTasks(prevTasks => {
//       return prevTasks.map(task => {
//         if (task.id === activeId) {
//           return { ...task, status: overContainer };
//         }
//         return task;
//       });
//     });

//     apiClient.put(`/tasks/${activeId}`, { status: overContainer })
//       .catch(error => {
//         console.error("Failed to update task status", error);
//         onUpdate();
//       });
//   };

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     if (!newTaskTitle.trim()) return;
//     try {
//       await apiClient.post(`/projects/${projectId}/tasks`, { title: newTaskTitle });
//       setNewTaskTitle('');
//       onUpdate(); 
//     } catch (error) {
//       console.error("Failed to add task", error);
//     }
//   };

//   // Handle task deletion
//   const handleDeleteTask = async (taskId) => {
//     try {
//       await apiClient.delete(`/tasks/${taskId}`);
//       setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
//       onUpdate();
//     } catch (error) {
//       console.error("Failed to delete task", error);
//     }
//   };

//   const columns = {
//     TODO: tasks.filter(t => t.status === 'TODO'),
//     IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
//     DONE: tasks.filter(t => t.status === 'DONE'),
//   };

//   return (
//     <div>
//       <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
//         <input 
//             type="text" 
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Add a new task to the board..."
//             className="flex-grow px-4 py-3 bg-brand-dark border border-gray-600 rounded-md text-white"
//         />
//         <button type="submit" className="px-5 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg">
//             Add Task
//         </button>
//       </form>

//       <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <KanbanColumn id="TODO" title="To Do" tasks={columns.TODO} onDelete={handleDeleteTask} />
//           <KanbanColumn id="IN_PROGRESS" title="In Progress" tasks={columns.IN_PROGRESS} onDelete={handleDeleteTask} />
//           <KanbanColumn id="DONE" title="Done" tasks={columns.DONE} onDelete={handleDeleteTask} />
//         </div>
//       </DndContext>
//     </div>
//   );
// };

// export default KanbanBoardTab;


import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { DndContext, closestCorners, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { useNavigate } from 'react-router-dom';

const KanbanBoardTab = ({ initialTasks, projectId, onUpdate }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTask, setActiveTask] = useState(null);

  // Better drag detection - requires 5px movement before starting drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeTaskData = tasks.find((t) => t.id === activeId);
    if (!activeTaskData) return;
    const activeContainer = activeTaskData.status;

    let overContainer;
    if (overId === 'TODO' || overId === 'IN_PROGRESS' || overId === 'DONE') {
      overContainer = overId;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      overContainer = overTask.status;
    }

    if (activeContainer === overContainer) {
      return;
    }
    
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === activeId) {
          return { ...task, status: overContainer };
        }
        return task;
      });
    });

    apiClient.put(`/tasks/${activeId}`, { status: overContainer })
      .catch(error => {
        console.error("Failed to update task status", error);
        onUpdate();
      });
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await apiClient.post(`/projects/${projectId}/tasks`, { title: newTaskTitle });
      setNewTaskTitle('');
      onUpdate(); 
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // await apiClient.delete(`/tasks/${taskId}`);
        // setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        // onUpdate();
        await apiClient.delete(`/tasks/${taskId}`);
        onUpdate();
      } catch (error) {
        // console.error("Failed to delete task", error);
        console.error("Failed to delete task", error);
        alert('Failed to delete task.');
      }
    }
  };

  const handleCardClick = (task) => {
      navigate(`/projects/${projectId}/tasks/${task.id}`);
  };

  const columns = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div>
      <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
        <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task to the board..."
            className="flex-grow px-4 py-3 bg-slate-800 border border-gray-600 rounded-md text-white"
        />
        <button type="submit" className="px-5 py-3 bg-indigo-600 hover:bg-brand-accent-hover text-white font-semibold rounded-lg">
            Add Task
        </button>
      </form>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn id="TODO" title="To Do" tasks={columns.TODO} onDelete={handleDeleteTask} onCardClick={handleCardClick}/>
          <KanbanColumn id="IN_PROGRESS" title="In Progress" tasks={columns.IN_PROGRESS} onDelete={handleDeleteTask} onCardClick={handleCardClick}/>
          <KanbanColumn id="DONE" title="Done" tasks={columns.DONE} onDelete={handleDeleteTask} onCardClick={handleCardClick}/>
        </div>
        
        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeTask ? (
            <div className="bg-white p-4 rounded-md shadow-2xl border-2 border-blue-400 rotate-3 scale-105 opacity-90">
              <p className="text-gray-800 font-medium">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoardTab;

