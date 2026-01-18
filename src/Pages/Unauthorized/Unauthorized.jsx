import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="max-w-md w-full text-center p-6">
                <CardHeader className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                    <h2 className="text-2xl font-bold text-red-600">Unauthorized</h2>
                </CardHeader>
                <CardContent className="mt-4 text-gray-700">
                    <p>
                        You do not have permission to access this page.
                    </p>
                </CardContent>
                <div className="mt-6">
                    <Button
                        variant="default"
                        onClick={() => navigate(-1)} // go back
                    >
                        Go Back
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Unauthorized;
