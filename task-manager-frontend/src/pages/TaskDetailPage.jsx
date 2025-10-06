// src/pages/TaskDetailPage.jsx

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../services/api';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const TaskDetailPage = () => {
//   const { projectId, taskId } = useParams();
//   const navigate = useNavigate();

//   const [task, setTask] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const commentsEndRef = useRef(null);

//   const fetchTaskData = async () => {
//     try {
//       const [taskRes, commentsRes] = await Promise.all([
//         apiClient.get(`/tasks/${taskId}`),
//         apiClient.get(`/tasks/${taskId}/comments`)
//       ]);
//       setTask(taskRes.data);
//       setComments(commentsRes.data);
//     } catch (error) {
//       console.error("Failed to fetch task data", error);
//     }
//   };

//   useEffect(() => {
//     fetchTaskData();

//     socket.emit('join_project', projectId);

//     const handleNewComment = (commentData) => {
//       console.log('[Frontend] Received new comment:', commentData);
//       if (commentData.taskId === parseInt(taskId)) {
//         setComments(prev => [...prev, commentData]);
//       }
//     };
//     socket.on('new_comment', handleNewComment);

//     return () => { socket.off('new_comment', handleNewComment); };
//   }, [projectId, taskId]);
  
//   const scrollToBottom = () => {
//     commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [comments]);

//   const handleSubmitComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     try {
//       await apiClient.post(`/tasks/${taskId}/comments`, { content: newComment });
//       setNewComment('');
//     } catch (error) {
//       console.error("Failed to post comment", error);
//     }
//   };

//   if (!task) return <div className="text-white text-center mt-10">Loading Task...</div>;

//   return (
//     <div className="container mx-auto px-4 py-8 text-white">
//       <button onClick={() => navigate(`/projects/${projectId}`)} className="mb-6 text-indigo-400 hover:text-indigo-300 font-semibold">
//         &larr; Back to Kanban Board
//       </button>

//       <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 flex flex-col h-[calc(100vh-200px)]">
//         <div className="pb-6 border-b border-slate-700">
//           <h1 className="text-3xl font-bold text-white">{task.title}</h1>
//           <p className="text-gray-400 mt-2">{task.description || 'No description provided.'}</p>
//         </div>

//         <div className="flex-grow py-6 overflow-y-auto pr-4">
//             {comments.map(comment => (
//                 <div key={comment.id} className="mb-4 flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0" title={comment.author.name}>
//                         {comment.author.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                         <p className="font-semibold text-white">{comment.author.name}</p>
//                         <p className="text-gray-300">{comment.content}</p>
//                     </div>
//                 </div>
//             ))}
//             <div ref={commentsEndRef} />
//         </div>

//         <div className="pt-6 border-t border-slate-700">
//           <form onSubmit={handleSubmitComment} className="flex gap-2">
//             <input
//               type="text"
//               value={newComment}
//               onChange={e => setNewComment(e.target.value)}
//               placeholder="Write a comment..."
//               className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
//             />
//             <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskDetailPage;

// src/pages/TaskDetailPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef(null);

  const fetchTaskData = async () => {
    try {
      const [taskRes, commentsRes] = await Promise.all([
        apiClient.get(`/tasks/${taskId}`),
        apiClient.get(`/tasks/${taskId}/comments`)
      ]);
      setTask(taskRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error("Failed to fetch task data", error);
    }
  };

  useEffect(() => {
    fetchTaskData();

    socket.emit('join_project', projectId);
    
    const handleNewComment = (commentData) => {
      console.log('[Frontend] Received new comment:', commentData);
      if (commentData.taskId === parseInt(taskId)) {
        // Prevent duplicate comments by checking if it already exists
        setComments(prev => {
          const exists = prev.some(c => c.id === commentData.id);
          if (exists) return prev;
          return [...prev, commentData];
        });
      }
    };
    socket.on('new_comment', handleNewComment);

    return () => { socket.off('new_comment', handleNewComment); };
  }, [projectId, taskId]);
  
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      // POST the comment and receive the created comment with author data
      const response = await apiClient.post(`/tasks/${taskId}/comments`, { content: newComment });
      
      // Immediately add the comment to local state with the response data
      // This ensures the current user sees their comment with their correct name
      const createdComment = response.data;
      setComments(prev => {
        const exists = prev.some(c => c.id === createdComment.id);
        if (exists) return prev;
        return [...prev, createdComment];
      });
      
      setNewComment('');
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  if (!task) return <div className="text-white text-center mt-10">Loading Task...</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <button onClick={() => navigate(`/projects/${projectId}`)} className="mb-6 text-indigo-400 hover:text-indigo-300 font-semibold">
        &larr; Back to Kanban Board
      </button>

      <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 flex flex-col h-[calc(100vh-200px)]">
        <div className="pb-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-white">{task.title}</h1>
          <p className="text-gray-400 mt-2">{task.description || 'No description provided.'}</p>
        </div>
        
        <div className="flex-grow py-6 overflow-y-auto pr-4">
            {comments.map(comment => (
                <div key={comment.id} className="mb-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0" title={comment.author.name}>
                        {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{comment.author.name}</p>
                        <p className="text-gray-300">{comment.content}</p>
                    </div>
                </div>
            ))}
            <div ref={commentsEndRef} />
        </div>

        <div className="pt-6 border-t border-slate-700">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;