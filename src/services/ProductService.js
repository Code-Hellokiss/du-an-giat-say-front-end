import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

// Lấy toàn bộ sản phẩm
export const getAllProducts = async () => {
    return await axios.get(API_URL);
};

// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

// Lấy sản phẩm theo Category ID
export const getProductsByCategoryId = async (categoryId) => {
    return await axios.get(`${API_URL}/category/${categoryId}`);
};

// Tạo sản phẩm mới
export const createProduct = async (product) => {
    return await axios.post(API_URL, product, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Cập nhật sản phẩm
export const updateProduct = async (id, product) => {
    return await axios.put(`${API_URL}/${id}`, product, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Xoá sản phẩm
export const deleteProduct = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};
