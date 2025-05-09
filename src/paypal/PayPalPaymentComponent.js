import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
    Divider,
    Snackbar,
    Alert,
    Fade
} from '@mui/material';

const VnpayPaymentComponent = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [link, setLink] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCreatePayment = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setSnackbar({ open: true, message: 'Vui lòng nhập số tiền hợp lệ.', severity: 'error' });
            return;
        }

        setLoading(true);
        setLink('');
        try {
            // Giả lập API trả link (thay bằng API thật của bạn)
            const fakeLink = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...';
            setTimeout(() => {
                setLink(fakeLink);
                setSnackbar({ open: true, message: 'Tạo thanh toán thành công!', severity: 'success' });
                setLoading(false);
            }, 1500);
        } catch (err) {
            setSnackbar({ open: true, message: 'Đã xảy ra lỗi.', severity: 'error' });
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
            p: 2
        }}>
            <Paper elevation={8} sx={{
                p: 4,
                borderRadius: 4,
                width: '100%',
                maxWidth: 400,
                textAlign: 'center',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)'
            }}>
                {/* Nếu bạn có logo, thay hình bên dưới */}
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/VNPAY_logo.svg/512px-VNPAY_logo.svg.png"
                    alt="VNPay Logo"
                    style={{ width: 120, marginBottom: 20 }}
                />

                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    Tạo thanh toán VNPay
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <TextField
                    label="Số tiền (VND)"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 2 }}
                    inputProps={{ min: 0 }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleCreatePayment}
                    disabled={loading}
                    sx={{
                        py: 1.8,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#1565c0' },
                        borderRadius: '50px'
                    }}
                    startIcon={!loading && '💳'}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo thanh toán'}
                </Button>

                <Fade in={!!link}>
                    <Box sx={{ mt: 4 }}>
                        <Typography color="green" fontWeight="bold" gutterBottom>
                            ✅ Tạo thanh toán thành công!
                        </Typography>
                        <Button
                            variant="outlined"
                            color="success"
                            href={link}
                            target="_blank"
                            sx={{
                                mt: 1,
                                borderRadius: '50px',
                                px: 3,
                                py: 1.2,
                                fontWeight: 'bold'
                            }}
                        >
                            Đi tới VNPay
                        </Button>
                    </Box>
                </Fade>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default VnpayPaymentComponent;
