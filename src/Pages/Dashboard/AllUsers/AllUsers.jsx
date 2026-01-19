import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical } from "lucide-react";
import Swal from "sweetalert2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useQuery({
        queryKey: ["users", status, page, limit],
        queryFn: async () => {
            const query = new URLSearchParams({ page, limit, });

            if (status !== "all") {
                query.append("status", status);
            }

            const res = await axiosSecure.get(
                `/users?${query.toString()}`
            );
            return res.data;
        },
        keepPreviousData: true,
    });

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];

    const updateStatus = useMutation({
        mutationFn: ({ id, status }) =>
            axiosSecure.patch(`/users/${id}/status`, { status }),
        onSuccess: () => queryClient.invalidateQueries(["users"]),
    });

    const updateRole = useMutation({
        mutationFn: ({ id, role }) =>
            axiosSecure.patch(`/users/${id}/role`, { role }),
        onSuccess: () => queryClient.invalidateQueries(["users"]),
    });

    if (isLoading) {
        return <Skeleton className="h-64 w-full rounded-xl" />;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">All Users</h1>

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.users.map(user => (
                        <TableRow key={user._id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                {user.name}
                            </TableCell>

                            <TableCell>{user.email}</TableCell>

                            <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                            </TableCell>

                            <TableCell>
                                <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                    {user.status}
                                </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <MoreVertical size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {user.status === "active" ? (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    updateStatus.mutate({ id: user._id, status: "blocked" })
                                                }
                                            >
                                                Block User
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    updateStatus.mutate({ id: user._id, status: "active" })
                                                }
                                            >
                                                Unblock User
                                            </DropdownMenuItem>
                                        )}

                                        {user.role !== "volunteer" && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    updateRole.mutate({ id: user._id, role: "volunteer" })
                                                }
                                            >
                                                Make Volunteer
                                            </DropdownMenuItem>
                                        )}

                                        {user.role !== "admin" && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    updateRole.mutate({ id: user._id, role: "admin" })
                                                }
                                            >
                                                Make Admin
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap  sticky bottom-0 bg-white py-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </Button>

                {pages.map(p => (
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
                    onValueChange={(val) => {
                        setLimit(Number(val));
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Rows" className="text-center text-black truncate" />
                    </SelectTrigger>
                    <SelectContent >
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

export default AllUsers;
