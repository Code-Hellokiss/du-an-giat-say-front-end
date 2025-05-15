import React, { useEffect, useState } from 'react';
import {
    Box, Button, Typography, TextField, Grid, Paper, Divider, MenuItem
} from '@mui/material';
import { createLaundryOrder } from '../services/LaundryOrderService';

const BookingPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('VNPay'); // Default payment

    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) {
            try {
                const parsed = JSON.parse(stored).map(item => ({
                    ...item,
                    basePrice: Number(item.basePrice) || 0,
                    expressPrice: Number(item.expressPrice) || 0,
                    quantity: Number(item.quantity) || 0
                }));
                setCartItems(parsed);
            } catch (e) {
                console.error('Lỗi khi parse giỏ hàng:', e);
            }
        }
    }, []);

    const calculateItemTotal = (item) => {
        const expressFee = item.express === 'express' ? item.expressPrice : 0;
        return (item.basePrice + expressFee) * item.quantity;
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const handleBooking = async () => {
        if (!address.trim()) {
            alert('❌ Vui lòng nhập địa chỉ.');
            return;
        }
        if (!pickupTime || !deliveryTime) {
            alert('❌ Vui lòng chọn thời gian nhận và giao đồ.');
            return;
        }

        const bookingData = {
            address,
            note,
            pickupTime,
            deliveryTime,
            paymentMethod, // Thêm phương thức thanh toán
            totalPrice,    // Gửi tổng giá trị đơn hàng
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                isExpress: item.express === 'express',
            })),
        };

        try {
            const response = await createLaundryOrder(bookingData);
            console.log('✅ API response:', response);

            alert('✅ Đặt lịch giặt thành công!');
            localStorage.removeItem('cart');
            setCartItems([]);
            setAddress('');
            setNote('');
            setPickupTime('');
            setDeliveryTime('');
            setPaymentMethod('VNPay');
        } catch (error) {
            console.error('❌ Lỗi khi đặt đơn hàng:', error);
            alert('❌ Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
        }
    };

    return (
        <Box maxWidth="800px" mx="auto" p={4}>
            <Typography variant="h4" gutterBottom>📅 Đặt lịch giặt</Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>🧺 Giỏ hàng</Typography>
                {cartItems.length === 0 ? (
                    <Typography>Không có sản phẩm nào trong giỏ hàng.</Typography>
                ) : (
                    <>
                        {cartItems.map((item, idx) => {
                            const itemTotal = calculateItemTotal(item);
                            return (
                                <Box key={idx} display="flex" justifyContent="space-between" my={1}>
                                    <Typography>
                                        {item.name} ({item.express === 'express' ? 'Nhanh' : 'Thường'}) × {item.quantity}
                                    </Typography>
                                    <Typography color="primary">
                                        {itemTotal.toLocaleString()} ₫
                                    </Typography>
                                </Box>
                            );
                        })}
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold">Tổng cộng</Typography>
                            <Typography fontWeight="bold" color="secondary">
                                {totalPrice.toLocaleString()} ₫
                            </Typography>
                        </Box>
                    </>
                )}
            </Paper>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Địa chỉ nhận đồ"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Thời gian nhận"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Thời gian giao"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={deliveryTime}
                        onChange={e => setDeliveryTime(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Phương thức thanh toán"
                        select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <MenuItem value="VNPay">VNPay</MenuItem>
                        <MenuItem value="PayPal">PayPal</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Ghi chú thêm"
                        multiline
                        rows={2}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </Grid>
            </Grid>

            <Box mt={4}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleBooking}
                    disabled={cartItems.length === 0}
                >
                    ✅ XÁC NHẬN ĐẶT LỊCH
                </Button>
            </Box>
        </Box>
    );
};

export default BookingPage;
