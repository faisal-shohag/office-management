/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { visitorReportByDate } from "@/lib/api";
import GenerateVisitorReport from "./GenerateVisitorReport";
import VisitorCount from "./VisitorCount";
import Alert2 from "@/components/app_components/Alert2";
const VisitorReport = () => {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [reportData, setReportData] = useState([]);
    const [totalVisitors, setTotalVisitors] = useState(0);

    const reportHandler = (e) => {
        e.preventDefault();
        visitorReportByDate(start, end)
            .then((res) => res.json())
            .then((data) => {
                setTotalVisitors(data.totalVisitors);
                setReportData(data.visitors);
            });
    };
    return (
        <>
            {" "}
            <div style={{ overflow: "hidden" }}>
                <h1 className="text-2xl font-bold mb-3">Visitor Report Details</h1>
                <form className="border p-5 rounded" onSubmit={reportHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-4">
                        <label htmlFor="Assign Teacher" className="md:col-span-1">
                            From
                            <Input
                                type="date"
                                name="fromdDate"
                                onChange={(e) => setStart(e.target.value)}
                            />
                        </label>
                        <label htmlFor="Assign Teacher" className="md:col-span-1">
                            To
                            <Input
                                type="date"
                                name="toDate"
                                onChange={(e) => setEnd(e.target.value)}
                            />
                        </label>
                    </div>
                    <Button size="sm" className="h-8 gap-1 mt-5">
                        Generate Report
                    </Button>
                </form>
            </div>
            {/* View Account */}
            {
                reportData.length == 0 ? <Alert2 title="No data found!" /> : <>
                    <VisitorCount totalVisitors={totalVisitors} />
                    <GenerateVisitorReport
                        start={start}
                        end={end}
                        data={reportData} />
                </>
            }

        </>
    );
};

export default VisitorReport;
