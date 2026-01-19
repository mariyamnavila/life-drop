import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useUserRole from "@/hooks/useUserRole";
import Loading from "@/Pages/Loading/Loading";

const ContentManagement = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { role, isLoading: roleLoading } = useUserRole()

    // Pagination & filtering
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState("all");

    // Fetch blogs
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["blogs", page, limit, status],
        queryFn: async () => {
            const query = new URLSearchParams({ page, limit });
            if (status !== "all") query.append("status", status);

            const res = await axiosSecure.get(`/blogs?${query.toString()}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];

    // Mutations
    const publishMutation = useMutation({
        mutationFn: async (blogId, newStatus) =>
            await axiosSecure.patch(`/blogs/${blogId}/status`, { status: newStatus }),
        onSuccess: () => {
            Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false });
            refetch();
        },
        onError: () => {
            Swal.fire({ icon: "error", title: "Failed!", text: "Please try again." });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (blogId) => await axiosSecure.delete(`/blogs/${blogId}`),
        onSuccess: () => {
            Swal.fire({ icon: "success", title: "Deleted!", timer: 1500, showConfirmButton: false });
            refetch();
        },
        onError: () => {
            Swal.fire({ icon: "error", title: "Failed!", text: "Please try again." });
        },
    });

    // Handlers
    const handlePublishToggle = (blog) => {
        const action = blog.status === "draft" ? "publish" : "unpublish";
        Swal.fire({
            title: `Are you sure you want to ${action} this blog?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                publishMutation.mutate(blog._id, blog.status === "draft" ? "published" : "draft");
            }
        });
    };

    const handleDelete = (blogId) => {
        Swal.fire({
            title: "Are you sure you want to delete this blog?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(blogId);
        });
    };

    if (isLoading || roleLoading) {
        return <Loading />
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Content Management</h1>
                <Button onClick={() => navigate("/dashboard/content-management/add-blog")}>
                    Add Blog
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
                <Select value={status} onValueChange={(val) => { setStatus(val); setPage(0); }}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && data?.blogs.length > 0 ? (
                        data.blogs.map((blog) => (
                            <TableRow key={blog._id}>
                                <TableCell>
                                    <img src={blog.thumbnail} alt={blog.title} className="w-20 h-12 object-cover rounded" />
                                </TableCell>
                                <TableCell>{blog.title}</TableCell>
                                <TableCell>{blog.author?.name || blog.author?.email}</TableCell>
                                <TableCell>{blog.status}</TableCell>
                                <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" onClick={() => navigate(`/dashboard/content-management/edit-blog/${blog._id}`)}>
                                        Edit
                                    </Button>

                                    {/* Publish/Unpublish for admin only */}
                                    {role === "admin" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handlePublishToggle(blog)}
                                        >
                                            {blog.status === "draft" ? "Publish" : "Unpublish"}
                                        </Button>
                                    )}

                                    {/* Delete for admin only */}
                                    {role === "admin" && (
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(blog._id)}>
                                            Delete
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                                {isLoading ? "Loading..." : "No blogs found"}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap sticky bottom-0 bg-white py-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Prev
                </Button>

                {pages.map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        variant={page === p ? "default" : "outline"}
                        onClick={() => setPage(p)}
                    >
                        {p + 1}
                    </Button>
                ))}

                <Button variant="outline" size="sm" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>
                    Next
                </Button>

                <Select
                    value={String(limit)}
                    onValueChange={(val) => { setLimit(Number(val)); setPage(0); }}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Rows" className="text-center text-black truncate" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ContentManagement;
