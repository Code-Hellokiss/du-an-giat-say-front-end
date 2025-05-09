import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { handlePaymentReturn } from '../services/VnpayService';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode');
        if (responseCode) {
            handlePaymentReturn(responseCode)
                .then((data) => {
                    setStatus(data.status);
                    setMessage(data.message);
                })
                .catch((err) => {
                    setStatus('fail');
                    setMessage(err.message || 'Có lỗi xảy ra khi xác nhận thanh toán.');
                });
        } else {
            setStatus('fail');
            setMessage('Không tìm thấy mã phản hồi từ VNPay.');
        }
    }, [searchParams]);

    // Inline styles
    const pageStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: status === 'success'
            ? 'linear-gradient(to bottom right, #d4edda, #c3e6cb)'
            : status === 'fail'
                ? 'linear-gradient(to bottom right, #f8d7da, #f5c6cb)'
                : '#f0f0f0',
        padding: '20px',
    };

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    };

    const iconStyle = {
        fontSize: '64px',
        marginBottom: '20px',
        color: status === 'success' ? '#28a745' : status === 'fail' ? '#dc3545' : '#333',
    };

    const headingStyle = {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '10px',
    };

    const messageStyle = {
        fontSize: '16px',
        color: '#555',
        marginBottom: '20px',
    };

    const buttonStyle = {
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: status === 'success' ? '#28a745' : '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    };

    const thankYouStyle = {
        marginTop: '15px',
        fontSize: '14px',
        color: '#666',
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={iconStyle}>
                    {status === 'success' ? '✔️' : status === 'fail' ? '❌' : '⏳'}
                </div>
                <h1 style={headingStyle}>
                    {status === 'success'
                        ? 'Thanh toán thành công!'
                        : status === 'fail'
                            ? 'Thanh toán thất bại!'
                            : 'Đang xử lý...'}
                </h1>
                <p style={messageStyle}>{message}</p>
                <button
                    onClick={() => window.location.href = '/'}
                    style={buttonStyle}
                >
                    Quay về trang chủ
                </button>
                {status === 'success' && (
                    <p style={thankYouStyle}>
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPage;
