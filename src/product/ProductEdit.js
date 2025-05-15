import React, { useEffect, useState } from 'react';
import { getProductById, updateProduct } from '../services/ProductService';
import { useParams, useNavigate } from 'react-router-dom';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await getProductById(id);
            setProduct(res.data);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'categoryId') {
            setProduct({ ...product, category: { id: value } });
        } else if (type === 'checkbox') {
            setProduct({ ...product, [name]: checked });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProduct(id, product);
        alert('Cập nhật thành công');
        navigate('/products');
    };

    if (!product) return <p>Đang tải...</p>;

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className="grid gap-3">
                <input name="name" value={product.name} onChange={handleChange} className="border p-2" required />
                <input name="description" value={product.description} onChange={handleChange} className="border p-2" />
                <input name="basePrice" type="number" value={product.basePrice} onChange={handleChange} className="border p-2" />
                <input name="imageUrl" value={product.imageUrl} onChange={handleChange} className="border p-2" />
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="expressAvailable" checked={product.expressAvailable} onChange={handleChange} />
                    Dịch vụ nhanh
                </label>
                <input name="expressPrice" type="number" value={product.expressPrice} onChange={handleChange} className="border p-2" />
                <input name="categoryId" value={product.category?.id} onChange={handleChange} className="border p-2" required />
                <button type="submit" className="bg-green-600 text-white py-2 rounded">Lưu</button>
            </form>
        </div>
    );
};

export default ProductEdit;
