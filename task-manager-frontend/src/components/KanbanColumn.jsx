// import React from 'react';
// import { useDroppable } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import KanbanTaskCard from './KanbanTaskCard';

// const KanbanColumn = ({ id, title, tasks, onDelete, onCardClick }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id: id,
//   });

//   const columnStyles = {
//     TODO: 'border-t-4 border-gray-400',
//     IN_PROGRESS: 'border-t-4 border-blue-500',
//     DONE: 'border-t-4 border-green-500',
//   };

//   return (
//     <div 
//       ref={setNodeRef}
//       className={`bg-slate-100 w-full p-4 rounded-lg shadow-inner transition-all duration-300 ease-in-out ${columnStyles[id]} ${
//         isOver ? 'bg-blue-50 ring-4 ring-blue-300 ring-opacity-50 scale-[1.02] shadow-xl' : ''
//       }`}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//         <span className="bg-slate-300 text-slate-600 font-bold text-sm px-2 py-1 rounded-full transition-all duration-200">
//           {tasks.length}
//         </span>
//       </div>
//       <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
//         <div className="min-h-[200px] space-y-3">
//           {tasks.map(task => (
//             <KanbanTaskCard key={task.id} task={task} onDelete={onDelete} onCardClick={onCardClick}/>
//           ))}
//         </div>
//       </SortableContext>
//     </div>
//   );
// };

// export default KanbanColumn;

// src/components/KanbanColumn.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanTaskCard from './KanbanTaskCard';

const KanbanColumn = ({ id, title, tasks, onDelete, onCardClick }) => {
  // Your logic using useDroppable is preserved
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const columnData = {
    TODO: { icon: '📝', color: 'border-gray-400' },
    IN_PROGRESS: { icon: '⏳', color: 'border-blue-500' },
    DONE: { icon: '✅', color: 'border-green-500' },
  };

  return (
    <div 
      ref={setNodeRef}
      // The className is updated for the new UI, but preserves your 'isOver' highlight
      className={`bg-slate-800/50 backdrop-blur-sm w-full p-4 rounded-xl border border-slate-700/50 transition-colors duration-300
        ${isOver ? 'bg-slate-700/50' : ''}`
      }
    >
      <div className={`flex justify-between items-center mb-4 pb-2 border-b-2 ${columnData[id].color}`}>
        <h3 className="text-md font-semibold text-white flex items-center gap-2">
          <span>{columnData[id].icon}</span>
          {title}
        </h3>
        <span className="bg-slate-700 text-slate-300 font-bold text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[200px] space-y-3">
          {tasks.map(task => (
            <KanbanTaskCard key={task.id} task={task} onDelete={onDelete} onCardClick={onCardClick}/>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;