import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Grid, Divider
} from '@mui/material';
import Navbar from '../home/Navbar';
import Footer from '../home/Footer';
import { fetchPostById } from "../services/postService";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const getPost = async () => {
            try {
                const data = await fetchPostById(id);
                setPost(data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy chi tiết bài viết:", err);
            }
        };
        getPost();
    }, [id]);

    if (!post) return <Typography textAlign="center" mt={10}>Đang tải...</Typography>;

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 10, mb: 6 }}>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        🌟 {post.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>

                    {/* Ảnh dạng lưới */}
                    {post.images?.length > 0 && (
                        <Grid container spacing={3} sx={{ my: 3 }}>
                            {post.images.map((img) => (
                                <Grid item xs={12} sm={6} md={4} key={img.id}>
                                    <Box
                                        component="img"
                                        src={img.images}
                                        alt="Ảnh bài viết"
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            boxShadow: 3,
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: 16, lineHeight: 1.75 }}>
                        {post.content}
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default PostDetail;
