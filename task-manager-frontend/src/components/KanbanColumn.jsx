// import React from 'react';
// import { useDroppable } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import KanbanTaskCard from './KanbanTaskCard';

// const KanbanColumn = ({ id, title, tasks, onDelete }) => {
//   // THIS IS CRITICAL - Makes the column a valid drop zone
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
//       className={`bg-slate-100 w-full p-4 rounded-lg shadow-inner transition-colors ${columnStyles[id]} ${
//         isOver ? 'bg-slate-200 ring-2 ring-blue-400' : ''
//       }`}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//         <span className="bg-slate-300 text-slate-600 font-bold text-sm px-2 py-1 rounded-full">
//           {tasks.length}
//         </span>
//       </div>
//       <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
//         <div className="min-h-[200px]">
//           {tasks.map(task => (
//             <KanbanTaskCard key={task.id} task={task} onDelete={onDelete} />
//           ))}
//         </div>
//       </SortableContext>
//     </div>
//   );
// };

// export default KanbanColumn;

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanTaskCard from './KanbanTaskCard';

const KanbanColumn = ({ id, title, tasks, onDelete, onCardClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const columnStyles = {
    TODO: 'border-t-4 border-gray-400',
    IN_PROGRESS: 'border-t-4 border-blue-500',
    DONE: 'border-t-4 border-green-500',
  };

  return (
    <div 
      ref={setNodeRef}
      className={`bg-slate-100 w-full p-4 rounded-lg shadow-inner transition-all duration-300 ease-in-out ${columnStyles[id]} ${
        isOver ? 'bg-blue-50 ring-4 ring-blue-300 ring-opacity-50 scale-[1.02] shadow-xl' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <span className="bg-slate-300 text-slate-600 font-bold text-sm px-2 py-1 rounded-full transition-all duration-200">
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