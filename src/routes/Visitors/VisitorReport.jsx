/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { deleteVisitor, visitorReportByDate } from "@/lib/api";
import GenerateVisitorReport from "./GenerateVisitorReport";
import VisitorCount from "./VisitorCount";
import Alert2 from "@/components/app_components/Alert2";
import toast from "react-hot-toast";
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

  
    const deleteHandler = (id) => {
        toast.promise(
            deleteVisitor(id).then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete!");
                }
                const newVisitors = reportData.filter((visitor) => visitor.id !== id);
                setReportData(newVisitors);
                
                return res.json();
            }),
            {
                loading: "Deleting ...",
                success: <b>Successfully deleted!</b>,
                error: <b>Failed to delete.</b>,
            }
        );
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
                        data={reportData}
                        deleteHandler={deleteHandler}
                         />
                </>
            }

        </>
    );
};

export default VisitorReport;
