

import axios from 'axios';

const API = 'http://localhost:5000/api/posts';

export const fetchPosts = () => axios.get(API);
export const createPost = (post, token) => axios.post(API, post, {
  headers: { Authorization: `Bearer ${token}` },
});
export const updatePost = (id, post, token) => axios.put(`${API}/${id}`, post, {
  headers: { Authorization: `Bearer ${token}` },
});
export const deletePost = (id, token) => axios.delete(`${API}/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});
export const likePost = (id, token) => axios.put(`${API}/${id}/like`, {}, {
  headers: { Authorization: `Bearer ${token}` },
});
export const dislikePost = (id, token) => axios.put(`${API}/${id}/dislike`, {}, {
  headers: { Authorization: `Bearer ${token}` },
});
// export const checkpostStatus=(id,token)=>axios.get(`${API}/${id}/status`,{},{
//   headers: { Authorization: `Bearer ${token}` },
// });
export const checkpostStatus = (id, token) =>
  axios.get(`${API}/${id}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
