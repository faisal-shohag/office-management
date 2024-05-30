import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";




// eslint-disable-next-line react/prop-types
const VisitorCount = ({ totalVisitors }) => {

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-1">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Visitor
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisitors}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VisitorCount;