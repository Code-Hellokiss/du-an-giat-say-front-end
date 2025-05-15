import React, { useEffect, useState } from 'react';
import {
    Box, Button, Card, CardContent, CardMedia, CircularProgress, FormControl, FormControlLabel,
    Grid, Radio, RadioGroup, Typography, IconButton, Drawer, Divider
} from '@mui/material';
import { Delete as DeleteIcon, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { getAllProducts, deleteProduct } from '../services/ProductService';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [expressOptions, setExpressOptions] = useState({});
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllProducts();
            setProducts(res.data);
        } catch (err) {
            console.error('❌ Lỗi khi lấy danh sách sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('🗑️ Bạn có chắc muốn xoá sản phẩm này?')) {
            try {
                setDeletingId(id);
                await deleteProduct(id);
                await fetchProducts();
            } catch (err) {
                console.error('❌ Xoá sản phẩm thất bại:', err);
                alert('❌ Xoá sản phẩm thất bại!');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleQuantityChange = (id, amount) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + amount)
        }));
    };

    const handleExpressChange = (id, value) => {
        setExpressOptions(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1;
        const express = expressOptions[product.id] === 'express';
        const newItem = {
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            express,
            quantity,
            price: product.basePrice,
            expressPrice: product.expressPrice || 0
        };

        const updatedCart = [...cart];
        const index = updatedCart.findIndex((item) => item.id === product.id && item.express === express);
        if (index >= 0) {
            updatedCart[index].quantity += quantity;
        } else {
            updatedCart.push(newItem);
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveFromCart = (index) => {
        const updated = [...cart];
        updated.splice(index, 1);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.quantity * (item.price + (item.express ? item.expressPrice : 0)),
        0
    );

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <Helmet>
                <title>Danh sách sản phẩm giặt ủi | Giặt sấy tiện lợi</title>
            </Helmet>

            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">📦 Danh sách sản phẩm giặt ủi</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ShoppingCart />}
                        onClick={() => setCartOpen(true)}
                    >
                        Giỏ Hàng ({totalQuantity})
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={6}>
                        <CircularProgress />
                    </Box>
                ) : products.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" mt={3}>
                        ⚠️ Chưa có sản phẩm nào.
                    </Typography>
                ) : (
                    <Grid container spacing={3} mt={2}>
                        {products.map((product) => {
                            const quantity = quantities[product.id] || 1;
                            const express = expressOptions[product.id] === 'express';
                            const finalPrice = product.basePrice + (express ? product.expressPrice || 0 : 0);

                            return (
                                <Grid item xs={12} md={6} key={product.id}>
                                    <Card sx={{ display: 'flex', gap: 2, p: 2 }}>
                                        <CardMedia
                                            component="img"
                                            image={product.imageUrl || '/placeholder.png'}
                                            alt={product.name}
                                            sx={{ width: 180, borderRadius: 2 }}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h6">{product.name}</Typography>
                                            <Typography variant="h5" color="primary">
                                                {finalPrice.toLocaleString()} ₫
                                            </Typography>
                                            {product.expressAvailable && (
                                                <FormControl sx={{ mt: 1 }}>
                                                    <RadioGroup
                                                        row
                                                        value={expressOptions[product.id] || 'normal'}
                                                        onChange={(e) => handleExpressChange(product.id, e.target.value)}
                                                    >
                                                        <FormControlLabel value="normal" control={<Radio />} label="Thường" />
                                                        <FormControlLabel
                                                            value="express"
                                                            control={<Radio />}
                                                            label={`Nhanh +${(product.expressPrice || 0).toLocaleString()} ₫`}
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                            <Box display="flex" alignItems="center" mt={1} gap={1}>
                                                <IconButton onClick={() => handleQuantityChange(product.id, -1)}><Remove /></IconButton>
                                                <Typography>{quantity}</Typography>
                                                <IconButton onClick={() => handleQuantityChange(product.id, 1)}><Add /></IconButton>
                                                <Button variant="contained" onClick={() => handleAddToCart(product)} sx={{ ml: 2 }}>
                                                    Thêm Vào Giỏ
                                                </Button>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deletingId === product.id}
                                                sx={{ mt: 2 }}
                                            >
                                                {deletingId === product.id ? 'Đang xoá...' : 'Xoá'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            {/* Giỏ hàng popup */}
            <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
                <Box sx={{ width: 360, p: 2 }}>
                    <Typography variant="h6" gutterBottom>🛒 Giỏ Hàng</Typography>
                    {cart.length === 0 ? (
                        <Typography color="text.secondary">Chưa có sản phẩm nào trong giỏ.</Typography>
                    ) : (
                        <>
                            {cart.map((item, index) => (
                                <Box key={index} display="flex" gap={1} alignItems="center" mb={2}>
                                    <img src={item.imageUrl} alt={item.name} width={60} height={60} style={{ borderRadius: 8 }} />
                                    <Box flex={1}>
                                        <Typography fontWeight="bold">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.express ? 'Giặt nhanh' : 'Giặt thường'} - SL: {item.quantity}
                                        </Typography>
                                        <Typography color="primary">
                                            {(item.quantity * (item.price + (item.express ? item.expressPrice : 0))).toLocaleString()} ₫
                                        </Typography>
                                    </Box>
                                    <IconButton size="small" onClick={() => handleRemoveFromCart(index)}><DeleteIcon /></IconButton>
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1">Tổng cộng: <strong>{totalPrice.toLocaleString()} ₫</strong></Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => {
                                    setCartOpen(false);
                                    navigate('/bookings');
                                }}
                            >
                                Đặt Lịch Giặt
                            </Button>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default ProductList;
