import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/Pages/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    FaFacebookF,
    FaTwitter,
    FaWhatsapp,
    FaLinkedinIn,
    FaLink
} from "react-icons/fa";
import {
    Calendar,
    User,
    Clock,
    ArrowLeft,
    Share2,
    CheckCircle2
} from "lucide-react";

const BlogDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [copied, setCopied] = React.useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["blog-details", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs/${id}`);
            return res.data.blog;
        },
    });

    if (isLoading) return <Loading />;

    if (!data) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16">
                <Card className="text-center p-12">
                    <div className="text-gray-400 mb-4">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Blog Not Found</h2>
                    <p className="text-gray-500">The blog post you're looking for doesn't exist.</p>
                </Card>
            </div>
        );
    }

    const shareUrl = window.location.href;

    const shareOnFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            "_blank",
            "width=600,height=400"
        );
    };

    const shareOnTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(data.title)}`,
            "_blank",
            "width=600,height=400"
        );
    };

    const shareOnWhatsApp = () => {
        window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(data.title + " " + shareUrl)}`,
            "_blank"
        );
    };

    const shareOnLinkedIn = () => {
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            "_blank",
            "width=600,height=400"
        );
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return minutes;
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            {/* Back Button */}
            <div className="max-w-6xl mx-auto px-4 pt-8">
                <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="mb-6 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blogs
                </Button>
            </div>

            <article className="max-w-6xl mx-auto px-4 pb-16">
                {/* Header Section */}
                <header className="mb-8">
                    {/* Category Badge (if available) */}
                    {data.category && (
                        <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-200">
                            {data.category}
                        </Badge>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {data.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {data.author?.name || data.author?.email}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                                {formatDate(data.created_at)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                                {calculateReadTime(data.content)} min read
                            </span>
                        </div>
                    </div>

                    <Separator className="mb-8" />
                </header>

                {/* Featured Image */}
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={data.thumbnail}
                        alt={data.title}
                        className="w-full h-100 md:h-125 object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x500?text=Blog+Image";
                        }}
                    />
                </div>

                {/* Blog Content */}
                <Card className="mb-12 border-0 shadow-lg">
                    <CardContent className="p-8 md:p-12">
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:text-gray-900 
                                prose-headings:font-bold
                                prose-p:text-gray-700 
                                prose-p:leading-relaxed
                                prose-a:text-red-600 
                                prose-a:no-underline
                                hover:prose-a:underline
                                prose-strong:text-gray-900
                                prose-ul:text-gray-700
                                prose-ol:text-gray-700
                                prose-blockquote:border-red-500
                                prose-blockquote:bg-red-50
                                prose-blockquote:px-6
                                prose-blockquote:py-4
                                prose-blockquote:rounded-r-lg
                                prose-img:rounded-xl
                                prose-img:shadow-md"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    </CardContent>
                </Card>

                {/* Social Share Section */}
                <Card className="sticky bottom-4 shadow-xl border-2">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-linear-to-r from-red-500 to-pink-500 p-2 rounded-lg">
                                    <Share2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Share this article</h3>
                                    <p className="text-sm text-gray-500">Spread the knowledge!</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    onClick={shareOnFacebook}
                                    size="lg"
                                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <FaFacebookF className="mr-2" />
                                    Facebook
                                </Button>
                                <Button
                                    onClick={shareOnTwitter}
                                    size="lg"
                                    className="bg-[#1DA1F2] hover:bg-[#1A94DA] text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <FaTwitter className="mr-2" />
                                    Twitter
                                </Button>
                                <Button
                                    onClick={shareOnWhatsApp}
                                    size="lg"
                                    className="bg-[#25D366] hover:bg-[#22C55E] text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <FaWhatsapp className="mr-2" />
                                    WhatsApp
                                </Button>
                                <Button
                                    onClick={shareOnLinkedIn}
                                    size="lg"
                                    className="bg-[#0A66C2] hover:bg-[#095196] text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <FaLinkedinIn className="mr-2" />
                                    LinkedIn
                                </Button>
                                <Button
                                    onClick={copyLink}
                                    size="lg"
                                    variant="outline"
                                    className="border-2 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <FaLink className="mr-2" />
                                            Copy Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Author Card (Optional) */}
                {data.author && (
                    <Card className="mt-8 bg-linear-to-r from-gray-50 to-white border-2">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-6">
                                <div className="bg-linear-to-br from-red-500 to-pink-500 rounded-full p-4 shrink-0">
                                    <User className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        About the Author
                                    </h3>
                                    <p className="text-lg font-semibold text-gray-700 mb-2">
                                        {data.author.name || data.author.email}
                                    </p>
                                    <p className="text-gray-600">
                                        {data.author.bio || "Passionate writer sharing insights and stories."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </article>
        </div>
    );
};

export default BlogDetails;