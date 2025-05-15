import React, { useEffect, useState } from 'react';
import {
    Box, TextField, Button, FormControl, InputLabel, Select, MenuItem,
    Checkbox, FormControlLabel, Typography
} from '@mui/material';
import { getAllCategories } from '../services/CategoryService';
import { createProduct } from '../services/ProductService';
import { uploadImageToCloudinary } from '../services/CloudinaryService';

const ProductCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        imageUrl: '',
        expressAvailable: false,
        expressPrice: '',
        categoryId: ''
    });

    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        getAllCategories()
            .then(res => {
                console.log("✅ Danh mục:", res);
                setCategories(res || []);
            })
            .catch(err => {
                console.error('❌ Lỗi lấy danh mục:', err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return '';
        try {
            return await uploadImageToCloudinary(imageFile);
        } catch (err) {
            console.error('❌ Lỗi upload ảnh:', err);
            return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryId) {
            alert('⚠️ Vui lòng chọn danh mục!');
            return;
        }

        try {
            const imageUrl = await handleImageUpload();
            const product = {
                ...formData,
                imageUrl: imageUrl || formData.imageUrl,
                basePrice: parseFloat(formData.basePrice),
                expressPrice: parseFloat(formData.expressPrice || 0),
                category: { id: parseInt(formData.categoryId) }
            };
            await createProduct(product);
            alert('✅ Tạo sản phẩm thành công!');
            // Reset form
            setFormData({
                name: '',
                description: '',
                basePrice: '',
                imageUrl: '',
                expressAvailable: false,
                expressPrice: '',
                categoryId: ''
            });
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            console.error('❌ Lỗi khi tạo sản phẩm:', err);
            alert('❌ Tạo sản phẩm thất bại!');
        }
    };

    const selectedCategory = categories.find(cat => String(cat.id) === formData.categoryId);

    return (
        <Box maxWidth={600} mx="auto" p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" gutterBottom>
                🧺 Tạo sản phẩm mới
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="name"
                    label="Tên sản phẩm"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    name="description"
                    label="Mô tả"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                />

                <TextField
                    name="basePrice"
                    label="Giá cơ bản"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    Tải ảnh
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                {imagePreview && (
                    <Box mt={2}>
                        <img
                            src={imagePreview}
                            alt="preview"
                            width={120}
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                        />
                    </Box>
                )}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.expressAvailable}
                            onChange={handleChange}
                            name="expressAvailable"
                        />
                    }
                    label="Dịch vụ nhanh"
                />

                <TextField
                    name="expressPrice"
                    label="Phụ thu nhanh"
                    type="number"
                    value={formData.expressPrice}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled={!formData.expressAvailable}
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        label="Danh mục"
                    >
                        <MenuItem value="">
                            <em>-- Chọn danh mục --</em>
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {categories.length === 0 && (
                        <Typography color="error" variant="body2">
                            ⚠️ Không có danh mục nào để chọn!
                        </Typography>
                    )}
                    {formData.categoryId && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Đã chọn: <strong>{selectedCategory?.name || ''}</strong>
                        </Typography>
                    )}
                </FormControl>

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                    ✅ Tạo sản phẩm
                </Button>
            </form>
        </Box>
    );
};

export default ProductCreate;
