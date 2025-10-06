// import React from 'react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const KanbanTaskCard = ({ task, onDelete }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   const handleDelete = (e) => {
//     e.stopPropagation();
//     onDelete(task.id);
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="group relative bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-3 cursor-grab active:cursor-grabbing active:shadow-lg"
//     >
//       <p className="text-gray-800 font-medium">{task.title}</p>
//       {task.status === 'DONE' && (
//         <button 
//           onClick={handleDelete} 
//           className="absolute top-1 right-1 text-gray-400 hover:text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//           aria-label="Delete task"
//         >
//           🗑️
//         </button>
//       )}
//     </div>
//   );
// };

// export default KanbanTaskCard;

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanTaskCard = ({ task, onDelete }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    opacity: isDragging ? 0.3 : 1,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative bg-white p-4 rounded-md shadow-sm border border-gray-200 
        cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-gray-300
        transition-all duration-200 ease-out
        ${isDragging ? 'z-50 shadow-2xl rotate-2' : 'hover:scale-[1.02]'}`}
    >
      <p className="text-gray-800 font-medium pr-6">{task.title}</p>

      {task.status === 'DONE' && (
        <button 
          onClick={handleDelete} 
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50 
            p-1.5 rounded-full opacity-0 group-hover:opacity-100 
            transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Delete task"
        >
          🗑️
        </button>
      )}
    </div>
  );
};

export default KanbanTaskCard;