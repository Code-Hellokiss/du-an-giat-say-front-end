import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress,
    Stack,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { uploadImageToCloudinary } from "../services/CloudinaryService";
import {createPost} from "../services/postService";
import {useNavigate} from "react-router-dom";

function PostForm() {
    const [post, setPost] = useState({ title: "", content: "" });
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const MAX_IMAGES = 5;

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > MAX_IMAGES) {
            alert(`❗ Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`);
            return;
        }
        setImages((prev) => [...prev, ...files]);
        setPreviewUrls((prev) => [
            ...prev,
            ...files.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewUrls];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setImages(newImages);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const uploadedUrls = await Promise.all(
                images.map((img) => uploadImageToCloudinary(img))
            );

            const payload = {
                ...post,
                images: uploadedUrls.map((url) => ({ images: url })),
            };

            await createPost(payload);
            alert("✅ Bài viết đã được đăng!");
            navigate("/posts"); // 👈 chuyển hướng sau khi đăng bài

        } catch (error) {
            console.error("❌ Đăng bài thất bại:", error);
            alert("❌ Đăng bài thất bại. Vui lòng thử lại.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6, mb: 10 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    📝 Đăng bài viết mới
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
                        📷 Chọn ảnh (tối đa 5)
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    {previewUrls.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2">Xem trước ảnh:</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                {previewUrls.map((url, index) => (
                                    <Box
                                        key={index}
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
                                            alt={`preview-${index}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(index)}
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

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={uploading}
                    >
                        {uploading ? <CircularProgress size={24} color="inherit" /> : "Đăng bài"}
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}

export default PostForm;
