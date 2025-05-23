import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Grid, Snackbar, Alert, IconButton
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../services/CategoryService';
import { uploadImageToCloudinary } from '../services/CloudinaryService';

const CategoryManagerComponent = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [imageFile, setImageFile] = useState(null);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
            setSnackbar({ open: true, message: 'Lỗi khi tải danh mục', severity: 'error' });
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = form.image;

            if (imageFile) {
                imageUrl = await uploadImageToCloudinary(imageFile);
            }

            const categoryData = { ...form, image: imageUrl };

            if (editingId) {
                await updateCategory(editingId, categoryData);
                setSnackbar({ open: true, message: 'Cập nhật danh mục thành công!', severity: 'success' });
            } else {
                await createCategory(categoryData);
                setSnackbar({ open: true, message: 'Thêm danh mục thành công!', severity: 'success' });
            }

            // Reset form
            setForm({ name: '', description: '', image: '' });
            setEditingId(null);
            setImageFile(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: 'Đã xảy ra lỗi!', severity: 'error' });
        }
    };

    const handleEdit = (category) => {
        setForm({ name: category.name, description: category.description, image: category.image });
        setEditingId(category.id);
        setImageFile(null);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            fetchCategories();
            setSnackbar({ open: true, message: 'Xóa danh mục thành công!', severity: 'info' });
        } catch (error) {
            console.error('Xóa lỗi:', error);
            setSnackbar({ open: true, message: 'Không thể xóa danh mục!', severity: 'error' });
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Quản lý danh mục</Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tên danh mục"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ width: '100%' }}
                        />
                        {/* Preview ảnh */}
                        {imageFile && (
                            <Box mt={2}>
                                <Typography variant="body2">Xem trước ảnh:</Typography>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="preview"
                                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleSubmit}>
                            {editingId ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
                {categories.map((cat) => (
                    <Grid container spacing={2} key={cat.id} alignItems="center" sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <Typography fontWeight="bold">{cat.name}</Typography>
                            {cat.image ? (
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                    }}
                                />
                            ) : (
                                <Typography color="text.secondary" fontStyle="italic">Không có ảnh</Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography color="text.secondary">{cat.description}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2} display="flex" justifyContent="flex-end">
                            <IconButton color="primary" onClick={() => handleEdit(cat)}><Edit /></IconButton>
                            <IconButton color="error" onClick={() => handleDelete(cat.id)}><Delete /></IconButton>
                        </Grid>
                    </Grid>
                ))}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoryManagerComponent;
