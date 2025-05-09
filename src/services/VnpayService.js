import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/vnpay';

export const createPaymentVnpay = async (amount) => {
    try {
        const response = await axios.post(`${API_BASE}/create-payment`, { amount });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : 'Lỗi kết nối server, vui lòng thử lại sau.';
    }
};
export const handlePaymentReturn = async (responseCode) => {
    try {
        const response = await axios.get(`${API_BASE}/payment-return?vnp_ResponseCode=${responseCode}`);

        if (response.status === 200) {
            return { status: 'success', message: response.data };  // Trả về thành công
        } else {
            throw new Error('Có lỗi xảy ra khi xác nhận thanh toán.');
        }
    } catch (error) {
        throw error.response
            ? error.response.data
            : 'Lỗi kết nối server, vui lòng thử lại sau.';  // Lỗi từ server hoặc mạng
    }
};
