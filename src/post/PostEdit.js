import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress,
    Stack,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../services/postService";
import { uploadImageToCloudinary } from "../services/CloudinaryService";

function PostEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: "", content: "" });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await fetchPostById(id);
                setPost({ title: data.title, content: data.content });
                setExistingImages(data.images.map(img => img.images));
            } catch (err) {
                console.error("Lỗi tải bài viết:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages((prev) => [...prev, ...files]);
        setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const uploadedUrls = await Promise.all(
                newImages.map((img) => uploadImageToCloudinary(img))
            );

            const payload = {
                ...post,
                images: [...existingImages, ...uploadedUrls].map((url) => ({ images: url })),
            };


            await updatePost(id, payload);
            alert("✅ Bài viết đã được cập nhật!");
            navigate("/posts");
        } catch (err) {
            console.error("Cập nhật lỗi:", err);
            alert("❌ Cập nhật thất bại!");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 6, mb: 10 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    ✏️ Chỉnh sửa bài viết
                </Typography>

                <Stack spacing={3}>
                    <TextField
                        label="Tiêu đề"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Nội dung"
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        fullWidth
                    />

                    <Button variant="outlined" component="label">
                        📷 Thêm ảnh mới
                        <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
                    </Button>

                    {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                        <Box>
                            <Typography variant="subtitle2">Ảnh xem trước:</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>

                                {/* Ảnh đã có từ trước */}
                                {existingImages.map((url, index) => (
                                    <Box
                                        key={`existing-${index}`}
                                        sx={{
                                            position: "relative",
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1,
                                            overflow: "hidden",
                                            border: "1px solid #ccc",
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`existing-${index}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveExistingImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                bgcolor: "rgba(255,255,255,0.8)",
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}

                                {/* Ảnh mới thêm */}
                                {newImagePreviews.map((url, index) => (
                                    <Box
                                        key={`new-${index}`}
                                        sx={{
                                            position: "relative",
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1,
                                            overflow: "hidden",
                                            border: "1px solid #ccc",
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`new-${index}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveNewImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                bgcolor: "rgba(255,255,255,0.8)",
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Button type="submit" variant="contained" fullWidth disabled={uploading}>
                        {uploading ? <CircularProgress size={24} color="inherit" /> : "Lưu thay đổi"}
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}

export default PostEdit;
