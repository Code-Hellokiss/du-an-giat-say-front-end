// src/App.js
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import HomePage from './home/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivateRoute from './routes/PrivateRoute';
import AdminAccountManager from './pages/AdminAccountManager';
import ProfilePage from './pages/ProfilePage';
import LaundryBookingComponent from './booking/LaundryBookingComponent';
import LaundryOrderHistory from './booking/LaundryOrderHistory';
import CategoryManagerComponent from './category/CategoryManagerComponent';
import AdminOrderList from './booking/AdminOrderList';
import OrderTracking from './booking/OrderTracking';
import UserOrderList from './booking/UserOrderList';
import ShipperOrderList from "./pages/ShipperOrderList";
import PaymentCancel from "./paypal/PaymentCancel";
import PayPalPaymentComponent from "./paypal/PayPalPaymentComponent";
import PaymentSuccess from "./paypal/PaymentSuccess";
// import ChatComponent from "./components/ChatComponent";
// import ChatRouteWrapper from "./components/ChatRouteWrapper";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import ChatPage from "./components/ChatPage";
import VnpayComponent from "./vnpay/VnpayComponent";
import PaymentResultPage from "./paypal/PaymentResultPage";
import PostForm from "./post/PostForm";
import PostList from "./post/PostList";
import PostEdit from "./post/PostEdit";
import PostDetail from "./post/PostDetail";
import ProductCreate from "./product/ProductCreate";
import ProductEdit from "./product/ProductEdit";
import ProductList from "./product/ProductList";
import BookingPage from "./booking/BookingPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/account-manager" element={<PrivateRoute><AdminAccountManager /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/booking" element={<PrivateRoute><LaundryBookingComponent /></PrivateRoute>} />
                <Route path="/history-booking" element={<PrivateRoute><LaundryOrderHistory /></PrivateRoute>} />
                <Route path="/categories" element={<PrivateRoute><CategoryManagerComponent /></PrivateRoute>} />
                <Route path="/order-list" element={<PrivateRoute><AdminOrderList /></PrivateRoute>} />
                <Route path="/order-tracking/:orderId" element={<PrivateRoute><OrderTracking initialStatus="PENDING" /></PrivateRoute>} />
                <Route path="/my-orders" element={<PrivateRoute><UserOrderList /></PrivateRoute>} />
                <Route path="/shipper-orders" element={<Navigate to="/shipper-orders/pending" replace />} />
                <Route path="/shipper-orders/:status" element={<ShipperOrderList />} />
                <Route path="/admin/post" element={<PostForm/>}/>
                <Route path="/posts/edit/:id" element={<PostEdit />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/posts" element={<PostList/>}/>
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/payment" element={<PayPalPaymentComponent/>}/>
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/ChatList" element={<ChatList/>}/>
                <Route path="/ChatWindow" element={<ChatWindow/>}/>
                <Route path="/Chat" element={<ChatPage/>}/>
                <Route path="/vnpay" element={<VnpayComponent/>}/>
               <Route path="/payment-result" element={<PaymentResultPage/>}/>
                <Route path="/creat-product" element={<ProductCreate/>}/>
                <Route path="/creat-edit" element={<ProductEdit/>}/>
                <Route path="/product" element={<ProductList/>}/>
                <Route path="/bookings" element={<BookingPage />} />


            </Routes>
        </Router>
    );
}

export default App;
