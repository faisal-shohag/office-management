import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { salaryReportByDate } from "@/lib/api";
import GenerateSallaryReport from "./GenerateSallaryReport";
import toast from "react-hot-toast";
const SalaryReport = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reportData, setReportData] = useState([]);
  const [income, setIncome] = useState("");
  /* Fetch Data */
  //useEffect(() => {}, [end, start]);
  const reportHandler = (e) => {
    e.preventDefault();
    toast.promise(
      salaryReportByDate(start, end)
        .then((res) => res.json())
        .then((data) => {
          if (data.err) {
            throw new Error("Failed to generate reoprt!");
          }

          setReportData(data);
        }),
      {
        loading: "Generating Report...",
        success: <b>Successfully generated!</b>,
        error: <b>Failed to generate.</b>,
      }
    );
  };
  useEffect(() => {
    // Calculate total income
    const totalIncome = reportData.reduce((acc, curr) => {
      return acc + parseFloat(curr.monthly_salary);
    }, 0);
    setIncome(totalIncome);

    // Calculate total expense
    /*    const totalExpense = reportData.reduce((acc, curr) => {
      if (curr.type === "expense") {
        return acc + parseFloat(curr.amount);
      } else {
        return acc;
      }
    }, 0);
    setExpense(totalExpense); */
  }, [reportData]);

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <h1 className="text-2xl font-bold mb-3">Report Details</h1>
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
      <GenerateSallaryReport
        reportData={reportData}
        start={start}
        end={end}
        income={income}
      />
    </>
  );
};

export default SalaryReport;
