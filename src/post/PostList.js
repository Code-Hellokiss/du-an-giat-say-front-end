import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    CircularProgress,
    Box,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { Delete, Edit, Visibility, Add } from "@mui/icons-material";
import { fetchAllPosts, deletePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const navigate = useNavigate();

    const loadPosts = async () => {
        try {
            const data = await fetchAllPosts();
            setPosts(data);
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deletePost(postToDelete.id);
            setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        } catch (err) {
            console.error("Xoá thất bại:", err);
        } finally {
            setDeleteDialogOpen(false);
            setPostToDelete(null);
        }
    };

    const handleViewClick = (post) => {
        setSelectedPost(post);
        setViewDialogOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">📰 Danh sách bài viết</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/post")}
                >
                    Đăng bài
                </Button>
            </Box>

            {posts.length === 0 ? (
                <Typography variant="h6" align="center">
                    🚫 Không có bài viết nào.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Card sx={{ height: "100%", position: "relative" }}>
                                {post.images?.length > 0 && post.images[0].images && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={post.images[0].images}
                                        alt={post.title}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {post.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        {post.content.length > 100
                                            ? `${post.content.substring(0, 100)}...`
                                            : post.content}
                                    </Typography>

                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleViewClick(post)}
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() =>
                                                navigate(`/posts/edit/${post.id}`)
                                            }
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(post)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog xác nhận xoá */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xoá bài viết</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xoá bài viết này?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Huỷ</Button>
                    <Button color="error" onClick={confirmDelete}>
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" fontWeight="bold">
                        {selectedPost?.title}
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={3}>

                        {selectedPost?.images?.length > 0 && (
                            <Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr 1fr",
                                            sm: "repeat(3, 1fr)",
                                            md: "repeat(4, 1fr)",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    {selectedPost.images.map((img, index) => (
                                        <Box
                                            key={index}
                                            component="img"
                                            src={img.images}
                                            alt={`Ảnh ${index + 1}`}
                                            sx={{
                                                width: "100%",
                                                height: 120,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                                boxShadow: 1,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Nội dung */}
                        <Box>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {selectedPost?.content}
                            </Typography>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
}

export default PostList;
