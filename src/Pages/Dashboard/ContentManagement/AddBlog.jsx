import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { addBlogSchema } from '@/schemas/addBlogSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const AddBlog = () => {
    const axiosSecure = useAxiosSecure();
    const editor = useRef(null);

    const [imageUploading, setImageUploading] = useState(false);
    const [content, setContent] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [contentError, setContentError] = useState("");
    const [thumbnailError, setThumbnailError] = useState("");


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(addBlogSchema)
    });

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (!imageFile) return;

        setThumbnailError("");
        setImageUploading(true);

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagebb_key}`,
                formData
            );

            setThumbnailUrl(res.data.data.url);
        } catch (error) {
            setThumbnailError("Image upload failed. Please try again.");
        } finally {
            setImageUploading(false);
        }
    };


    const createBlogMutation = useMutation({
        mutationFn: async (blogData) => {
            const res = await axiosSecure.post("/blogs", blogData);
            return res.data;
        },
        onSuccess: () => {
            reset();
            setContent("");
            setThumbnailUrl("");

            Swal.fire({
                icon: "success",
                title: "Blog created",
                text: "Your blog has been saved as a draft.",
                timer: 2000,
                showConfirmButton: false,
            });
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Failed to create blog. Please try again.",
            });
        }
    });

    const onSubmit = async (data) => {
        let hasError = false;

        if (!content) {
            setContentError("Blog content is required");
            hasError = true;
        } else {
            setContentError("");
        }

        if (!thumbnailUrl) {
            setThumbnailError("Thumbnail image is required");
            hasError = true;
        }

        if (hasError) return;

        const blogData = {
            title: data.title,
            thumbnail: thumbnailUrl,
            content,
            status: "draft"
        };

        createBlogMutation.mutate(blogData);
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Add New Blog</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Title */}
                    <div className="space-y-2">
                        <Label>Blog Title</Label>
                        <Input {...register("title")} placeholder="Enter blog title" />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-2">
                        <Label>Thumbnail Image</Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        {imageUploading && (
                            <p className="text-sm text-muted-foreground">Uploading image...</p>
                        )}
                        {thumbnailError && (
                            <p className="text-sm text-red-500">{thumbnailError}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label>Blog Content</Label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onBlur={(newContent) => setContent(newContent)}
                            onChange={() => { }}
                        />
                        {contentError && (
                            <p className="text-sm text-red-500">{contentError}</p>
                        )}

                    </div>

                    {/* Submit */}
                    <Button type="submit" disabled={createBlogMutation.isLoading || imageUploading}>
                        {createBlogMutation.isLoading ? "Creating..." : "Create Blog"}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );

};

export default AddBlog;