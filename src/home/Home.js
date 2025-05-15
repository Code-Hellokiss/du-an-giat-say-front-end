import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Grid, Box, Button
} from '@mui/material';
import Navbar from '../home/Navbar';
import ServiceCard from '../components/ServiceCard';
import Footer from '../home/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatWidget from '../home/ChatWidget';
import axios from 'axios';

const services = [
    {
        title: 'Nhân viên giặt ủi 247 giàu kinh nghiệm',
        desc: 'Quần áo và trang phục của bạn sẽ được giặt ủi bởi những nhân viên giàu kinh nghiệm đã gắn bó lâu năm với 247...',
        image: 'https://giatui247.vn/web/image/2932-94339f4f/Screen%20Shot%202023-07-02%20at%2017.34.45.png',
    },
    {
        title: 'Máy móc thiết bị giặt ủi hiện đại',
        desc: 'Giặt ủi 247 luôn chú trọng đầu tư trang thiết bị hiện đại như máy giặt, máy sấy, bàn ủi...',
        image: 'https://giatui247.vn/web/image/2936-0b088fde/tiem-giat-ui-247.png',
    },
    {
        title: 'Giặt ủi với bột giặt nước xả thân thiện',
        desc: 'Nguyên liệu nhập khẩu, an toàn cho sức khỏe và môi trường, có xuất xứ rõ ràng...',
        image: 'https://giatui247.vn/web/image/2937-8db394c7/su-dung-nuoc-xa-dung-cach.png',
    },
    {
        title: 'Quy trình giặt ủi chặt chẽ - tinh gọn',
        desc: 'Dựa trên kỹ thuật nghiệp vụ, mỗi khâu có biểu mẫu theo dõi, hạn chế sai sót tối đa...',
        image: 'https://giatui247.vn/web/image/2940-e9ac95b5/quy-trinh-xu-ly-giat-ui-247.png',
    },
    {
        title: 'Trải nghiệm dịch vụ vượt trội',
        desc: 'Tư vấn 24/7, khuyến mãi hấp dẫn, ghi nhận đánh giá khách quan từ khách hàng...',
        image: 'https://giatui247.vn/web/image/2942-5fdec6ea/dich-vu-giat-ui-cao-cao.jpeg',
    },
    {
        title: 'Tiện lợi và nhanh chóng hơn',
        desc: 'Giao nhận tận nhà, hỗ trợ qua Web/App, gần các khu dân cư thuận tiện...',
        image: 'https://giatui247.vn/web/image/3023-e9da73a1/giat-ui-247-giao-nha.jpg',
    },
];

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/posts');
            setPosts(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy bài đăng:", err);
        }
    };

    return (
        <>
            <Navbar />

            <Box
                sx={{
                    position: 'relative',
                    height: { xs: '40vh', md: '60vh' },
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                }}
            >
                {/* Ảnh nền độ phân giải cao từ Unsplash */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/481772372_1227008262760291_2331240192816776669_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeEN96_wQbpi3-DRsILAj0rKOqgZujRWHy86qBm6NFYfLzxdL72NysOr-nXVsL03IibEGOnS1UViAV5ngEEinyEW&_nc_ohc=hiMQrpG451EQ7kNvwGGpPZs&_nc_oc=AdnMqHeToRSzJ_tYR9RL7nJ7A3O7b-BBdlKAyeB5ROHgOXfjq2yMCItHPjrHiAQonkA&_nc_zt=23&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=5ZsD7uZyyWKaz_ID1NhHLg&oh=00_AfJfk1PQcCKoBoQ-Qpsewf5R1rit8CHPMd94ZV3V92EM6Q&oe=68287F1E)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.6)',
                        zIndex: 1,
                    }}
                />

            </Box>



            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Giới thiệu về FastLaundry
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    FastLaundry là dịch vụ giặt sấy chuyên nghiệp, mang đến trải nghiệm giặt ủi tiện lợi ngay tại nhà bạn...
                </Typography>
            </Container>

            <Container sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Dịch vụ giặt ủi cao cấp và chuyên nghiệp nhất
                </Typography>
                <Typography variant="h6" paragraph sx={{ marginBottom: 4 }}>
                    Giặt ủi tại FastLaundry giúp bạn tiết kiệm thời gian, tự tin với quần áo thơm sạch, chỉnh chu...
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {services.map((s, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <ServiceCard title={s.title} desc={s.desc} image={s.image} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Box sx={{ mt: 10, py: 6, bgcolor: '#e3f2fd' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        Quy trình giặt sấy tại FastLaundry
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { step: '1️⃣ Đặt lịch', desc: 'Đặt lịch online hoặc gọi hotline.' },
                            { step: '2️⃣ Giao nhận tận nơi', desc: 'Nhân viên lấy đồ đúng giờ.' },
                            { step: '3️⃣ Giặt & sấy', desc: 'Sử dụng máy giặt chuyên dụng.' },
                            { step: '4️⃣ Giao lại', desc: 'Giao đồ sạch sẽ thơm mát đến tận nhà.' },
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Typography variant="h6" fontWeight="bold">{item.step}</Typography>
                                <Typography>{item.desc}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ mt: 10, bgcolor: '#f9fafb', py: 6 }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        Vì sao chọn FastLaundry?
                    </Typography>
                    <Typography variant="h6" textAlign="center" paragraph sx={{ marginBottom: 6 }}>
                        FastLaundry là tiệm giặt ủi gần đây được nhiều khách hàng yêu thích và lựa chọn...
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            {
                                image: 'https://cdn-icons-png.flaticon.com/512/2942/2942821.png',
                                title: '1. Tiết kiệm thời gian - Giảm việc nhà',
                                desc: 'Dịch vụ giặt ủi giúp bạn tiết kiệm thời gian và công sức...',
                            },
                            {
                                image: 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
                                title: '2. Tiết kiệm không gian sống cho bạn',
                                desc: 'Không cần máy giặt tại nhà, tiết kiệm diện tích sinh hoạt...',
                            },
                            {
                                image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
                                title: '3. Tiết kiệm chi phí sinh hoạt của bạn',
                                desc: 'Dịch vụ chất lượng với giá hợp lý, tiết kiệm chi phí bảo trì thiết bị...',
                            },
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        px: 3,
                                        py: 4,
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.title}
                                        sx={{ width: 80, height: 80, objectFit: 'contain', mb: 3 }}
                                    />
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Cam kết của chúng tôi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    ✅ Quần áo giặt riêng từng khách<br />
                    ✅ Cam kết đúng hẹn hoặc hoàn tiền<br />
                    ✅ Đền bù nếu có hư hỏng/mất mát
                </Typography>
            </Container>

            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bài viết mới từ FastLaundry
                </Typography>
                <Grid container spacing={4}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Box
                                sx={{
                                    bgcolor: 'white',
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {/* Ảnh đầu tiên nếu có */}
                                {post.images && post.images.length > 0 && (
                                    <Box
                                        component="img"
                                        src={post.images[0].images}
                                        alt={post.title}
                                        sx={{
                                            width: '100%',
                                            height: 180,
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            mb: 2,
                                        }}
                                    />
                                )}

                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {post.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {post.content.length > 100
                                        ? post.content.slice(0, 100) + '...'
                                        : post.content}
                                </Typography>

                                <Button
                                    component={Link}
                                    to={`/posts/${post.id}`}
                                    variant="text"
                                    size="small"
                                    sx={{ mt: 2, alignSelf: 'flex-start' }}
                                >
                                    Xem chi tiết
                                </Button>

                                <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>


            <Box sx={{ mt: 10, py: 4, bgcolor: '#e3f2fd', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    Cần giặt đồ lấy liền hãy đặt dịch vụ tại Giặt ủi 247
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                    Đặt giặt ủi dễ dàng, đồng bộ tức thời tới Tiệm gần nhất. Giao nhận tận nơi!
                </Typography>
            </Box>

            <Box sx={{ mt: 10, py: 6, bgcolor: '#2196f3', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    Sẵn sàng để quần áo luôn thơm mát & sạch sẽ?
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate(isAuthenticated ? '/booking' : '/login')}
                >
                    Đặt lịch ngay
                </Button>
            </Box>

            <ChatWidget />
            <Footer />
        </>
    );
};

export default HomePage;
