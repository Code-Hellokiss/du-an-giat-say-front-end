import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchAllPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách bài viết:', error);
        throw error;
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy bài viết ID=${id}:`, error);
        throw error;
    }
};

export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, postData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi tạo bài viết:', error);
        throw error;
    }
};

export const updatePost = async (id, postData) => {
    try {
        const response = await axios.put(`${API_URL}/update/${id}`, postData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật bài viết ID=${id}:`, error);
        throw error;
    }
};

// ✅ Xóa bài viết
export const deletePost = async (id) => {
    try {
        await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    } catch (error) {
        console.error(`❌ Lỗi khi xóa bài viết ID=${id}:`, error);
        throw error;
    }
};
