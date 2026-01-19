import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Loading from "@/Pages/Loading/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxios from "@/hooks/useAxios";
import { Link } from "react-router-dom";

const Blog = () => {
    const axiosInstance = useAxios()
    // Pagination
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(6);

    // Fetch published blogs
    const { data, isLoading } = useQuery({
        queryKey: ["published-blogs", page, limit],
        queryFn: async () => {
            const res = await axiosInstance.get(`/blogs/published?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    if (isLoading) return <Loading />;

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Our Blogs</h1>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.blogs.map((blog) => (
                    <Card key={blog._id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 pt-0">
                        <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <CardContent className={''}>
                            <CardHeader className="space-y-2 px-4">
                                <CardTitle className="text-lg font-semibold">{blog.title}</CardTitle>
                                <CardDescription className="text-gray-600 text-sm line-clamp-3">
                                    {/* Limit content preview to ~150 characters */}
                                    {blog.content.replace(/<[^>]+>/g, "").substring(0, 150)}...
                                </CardDescription>
                            </CardHeader>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-xs text-gray-500">
                                    By: {blog.author?.name || blog.author?.email}
                                </p>
                                <Link to={`/blogs/${blog._id}`}>
                                    <Button
                                        size="sm"
                                    >
                                        Read More
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
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

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(page + 1)}
                >
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

export default Blog;
