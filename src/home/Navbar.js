import React, { useState, useEffect, useCallback } from 'react';
import {
    AppBar, Toolbar, Typography, InputBase, Box, Button, alpha, styled,
    IconButton, Menu, MenuItem, useMediaQuery, useTheme, Badge, Snackbar, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllOrders, getOrdersByShipperId } from '../services/LaundryOrderService';
import { connectShipperWebSocket, disconnectShipperWebSocket } from '../utils/shipperSocket';

// Styled components
const SearchWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha('#fff', 0.15),
    '&:hover': {
        backgroundColor: alpha('#fff', 0.25),
    },
    marginLeft: theme.spacing(2),
    width: '100%',
    maxWidth: 300,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#fff',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 2, 1, 2),
    },
}));

const FlashingBadge = styled(Badge)(({ theme }) => ({
    animation: 'flash 1s infinite',
    '@keyframes flash': {
        '0%': { opacity: 1 },
        '50%': { opacity: 0.3 },
        '100%': { opacity: 1 },
    }
}));

// Navbar Component
const Navbar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [orderCounts, setOrderCounts] = useState({ PENDING: 0, PICKED_UP: 0, IN_PROCESS: 0, PAID: 0 });
    const [flashPending, setFlashPending] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const { isAuthenticated, username, logout, role } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    // Fetch order counts
    const fetchOrderCounts = useCallback(async () => {
        try {
            let orders = [];
            const shipperId = localStorage.getItem('userId');
            if (role === 'shipper' && shipperId) {
                orders = await getOrdersByShipperId(shipperId);
            } else if (role === 'staff' || role === 'admin') {
                orders = await getAllOrders();
            }

            const counts = { PENDING: 0, PICKED_UP: 0, IN_PROCESS: 0, PAID: 0 };
            orders.forEach(o => {
                if (!o.deletedByShipper && counts[o.status]) {
                    counts[o.status]++;
                }
            });
            setOrderCounts(counts);
        } catch (err) {
            console.error('❌ Không thể tải đơn hàng:', err);
        }
    }, [role]);

    // Handle WebSocket & order counts
    useEffect(() => {
        fetchOrderCounts();

        const shipperId = localStorage.getItem('userId');
        if (role === 'shipper' && shipperId) {
            connectShipperWebSocket(shipperId, (message) => {
                setSnackbar({
                    open: true,
                    message: message.message || '📦 Có đơn hàng mới!',
                    severity: 'info'
                });
                setFlashPending(true);
                setTimeout(() => setFlashPending(false), 3000);
                fetchOrderCounts();
            });
        }

        return () => {
            if (role === 'shipper') disconnectShipperWebSocket();
        };
    }, [fetchOrderCounts, role]);

    // Actions
    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch?.(searchQuery);
            navigate('/');
        }
    };

    const handleClear = () => setSearchQuery('');
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Badge
    const getBadge = (label, count, color, flashing = false) => (
        flashing ? (
            <FlashingBadge badgeContent={count} color={color} sx={{ ml: 1 }}>
                <Typography sx={{ fontSize: '0.875rem' }}>{label}</Typography>
            </FlashingBadge>
        ) : (
            <Badge badgeContent={count} color={color} sx={{ ml: 1 }}>
                <Typography sx={{ fontSize: '0.875rem' }}>{label}</Typography>
            </Badge>
        )
    );

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#2196f3' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center" flex={1}>
                        <LocalLaundryServiceIcon sx={{ mr: 1 }} />
                        <Typography variant="h6" noWrap>FastLaundry</Typography>

                        {!isMobile && (
                            <SearchWrapper>
                                <StyledInputBase
                                    placeholder="Tìm kiếm dịch vụ…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                {searchQuery && (
                                    <IconButton onClick={handleClear} sx={{ color: 'white' }} size="small">
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <IconButton onClick={handleSearch} sx={{ color: 'white' }}>
                                    <SearchIcon />
                                </IconButton>
                            </SearchWrapper>
                        )}
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                        {!isMobile && (
                            <>
                                <Button color="inherit" onClick={() => navigate('/')}>Trang chủ</Button>
                                {role === 'customer' && (
                                    <>
                                        <Button color="inherit" onClick={() => navigate('/booking')}>Đặt lịch</Button>
                                        <Button color="inherit" onClick={() => navigate('/my-orders')}>Đơn của tôi</Button>
                                    </>
                                )}
                                {role === 'staff' && (
                                    <Button color="inherit" onClick={() => navigate('/order-list')}>
                                        {getBadge('Xem Đơn Hàng', orderCounts.PENDING, 'info')}
                                    </Button>
                                )}
                                {role === 'shipper' && (
                                    <>
                                        <Button color="inherit" onClick={() => navigate('/shipper-orders/pending')}>
                                            {getBadge('Đơn cần giao', orderCounts.PENDING, 'error', flashPending)}
                                        </Button>
                                        <Button color="inherit" onClick={() => navigate('/shipper-orders/picked_up')}>
                                            {getBadge('Đã lấy', orderCounts.PICKED_UP, 'primary')}
                                        </Button>
                                        <Button color="inherit" onClick={() => navigate('/shipper-orders/paid')}>
                                            {getBadge('Đã thanh toán', orderCounts.PAID, 'success')}
                                        </Button>
                                    </>
                                )}
                                {role === 'admin' && (
                                    <>
                                        <Button color="inherit" onClick={() => navigate('/order-list')}>Quản lý đơn</Button>
                                        <Button color="inherit" onClick={() => navigate('/account-manager')}>Quản lý tài khoản</Button>
                                        <Button color="inherit" onClick={() => navigate('/categories')}>Thêm Loại Dịch Vụ</Button>
                                        <Button color="inherit" onClick={() => navigate('/posts')}>Đăng Bài</Button>
                                    </>
                                )}
                                <Button color="inherit" onClick={() => navigate('/about')}>Giới thiệu</Button>
                                <Button color="inherit" onClick={() => navigate('/contact')}>Liên hệ</Button>
                            </>
                        )}

                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <AccountCircle />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {isAuthenticated ? (
                                <>
                                    <MenuItem disabled>👋 Xin chào, {username}</MenuItem>
                                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Thông tin cá nhân</MenuItem>
                                    <MenuItem onClick={() => { navigate('/reset-password'); handleMenuClose(); }}>Đổi mật khẩu</MenuItem>
                                    <MenuItem onClick={() => { logout(); navigate('/login'); }}>Đăng xuất</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={() => navigate('/login')}>Đăng nhập</MenuItem>
                                    <MenuItem onClick={() => navigate('/register')}>Đăng ký</MenuItem>
                                </>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
};

export default Navbar;
