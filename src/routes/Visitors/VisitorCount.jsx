import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getCount } from "@/lib/api";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getData } from "@/lib/GET";



const VisitorCount = () => {
    const [count, setCount] = useState(null)

    const [transactions, setTransactions] = useState(null)
    useEffect(() => {
        getCount()
            .then(res => res.json())
            .then(data => {
                setCount(data)
            })

        getData('transactions/total')
            .then(res => res.json())
            .then(data => {
                setTransactions(data)
            })
    }, [])

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Visitor
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{/* {count ? count.teacher : <Spinner/>} */}10</div>
                        {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Last 7 Days
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{/* {count ? count.student : <Spinner/>} */}7</div>
                        {/* <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p> */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VisitorCount;