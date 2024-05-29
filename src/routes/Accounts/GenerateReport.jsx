/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { dateTime } from "@/lib/api";
import Alert from "@/components/app_components/Alert";
import generatePDF, { Margin, Resolution, usePDF } from "react-to-pdf";
const GenerateReport = ({ reportData, start, end, income, expense }) => {
  const { targetRef } = usePDF();
  const downloadHandler = () => {
    // setTimeout(() => {
    //const id = parseInt(document.getElementById("student_id2").value);
    generatePDF(targetRef, {
      filename: `TRANSACTION_REPORT.pdf`,
      method: open,
      resolution: Resolution.HIGH,
      page: {
        margin: Margin.SMALL,
      },
    });
  };
  return (
    <TooltipProvider>
      {reportData.length == 0 ? (
        <Alert title="Please select the range of the report!" />
      ) : (
        <>
        <div className="mt-5">
                <Button
                  onClick={downloadHandler}
                  variant="destructive"
                  size="sm"
                  className="flex gap-2 float-end"
                >
                  <Download size={19} /> Download as PDF
                </Button>
              </div>
        <main className="">
            
              <Card x-chunk="dashboard-06-chunk-0">
              
                <div ref={targetRef}>
                  <div className="mx-auto my-10">
                    <center>
                      <img src="https://i0.wp.com/inspireditbd.com/wp-content/uploads/2023/07/logo-scaled.webp?fit=512%2C120&ssl=1" />
                    </center>
                    <div className="flex justify-center mt-2 mx-auto items-center mb-6">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold">
                          Account Report
                        </h1>
                      </div>
                    </div>
                    <div className="flex justify-center items-center mb-6">
                      <div className="font-bold">
                        <span>{dateTime(new Date(start))} - {dateTime(new Date(end))}</span>
                      </div>
                     
                    </div>
                    <hr></hr>
                    <div className="text-2xl">
                      {reportData.map((item) => (
                        <div className="lg:flex grid grid-cols-2 gap-6 justify-between items-center m-6 ">
                          <div key={item.id}>
                            <b>DATE</b>
                            <p>=========</p>
                            <p>{dateTime(new Date(item.date))}</p>
                          </div>
                          <div>
                            <b>TRN/TYPE</b>
                            <p>===================</p>
                            <p>{item.transaction_type}</p>
                          </div>
                          <div>
                            <b>TRANSACTION PURPOSE</b>
                            <p>===================</p>
                            {item.type == "income" ? (
                              <p>Income</p>
                            ) : (
                              <p>Expense</p>
                            )}
                          </div>

                          <div>
                            <b>BALANCE</b>
                            <p>{item.amount} ৳</p>
                          </div>
                        </div>
                      ))}

                      <div>
                        <div className="ml-6 flex justify-between border-b-2 border-black items-center font-bold align-middle"></div>
                        <div className="flex justify-between ml-6 border-b-2 border-black items-center font-bold">
                          <p>TOTAL EXPENSE/INCOME</p>
                          <div className="flex justify-between gap-6 lg:mr-20 mb-10 mt-10 ">
                            <p className="lg:mr-16">EXPENSE: {expense} ৳</p>
                            <p className="lg:mr-20">INCOME: {income} ৳</p>
                            <p className="">TOTAL: {income - expense} ৳</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
        </main>
        </>
      )}
    </TooltipProvider>
  );
};

export default GenerateReport;
