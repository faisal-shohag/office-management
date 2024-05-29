
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getData } from '@/lib/GET';
import Spinner from '../Spinner';
import Loading from "../Loading";
import { dateTime } from "@/lib/api";
import { MdAnalytics } from "react-icons/md";
const api_key = import.meta.env.VITE_apiKey;



 
const Transaction = () => {

  const [date, setDate] = useState(new Date())
  const [monthly, setMonthly ] = useState([])
  const [transactions, setTransactions] = useState([])
  const [isData, setIsData] = useState(false)

  const [isDate2, setIsData2] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(()=> {
    getData('transactions/with-month')
    .then(res=>res.json())
    .then(data=> {
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      data.sort((a, b) => {
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    })
      setMonthly(data)
    })

  }, [])

  useEffect(() => {
  
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${api_key}transactions_per_page?page=${currentPage}&limit=${limit}`);
        const data = await response.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
        setIsData(true)
        setIsData2(true)
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();

  }, [currentPage])


  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setIsData2(false)
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setIsData2(false)
      setCurrentPage(currentPage + 1);
    }
  };
  

  const chartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Transaction",
        data: monthly.map(entry => entry.netProfit),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#00A86B"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: monthly.map(entry => entry.month),
      },
      yaxis: {
        labels: {
          
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };



  return (
    <div>
      <main className="grid grid-cols-4 gap-5">
        
        <div className="col-span-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Latest Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your institution.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  Report
                  <MdAnalytics className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!isData ? <Loading /> :
              <>
              {
                transactions.length > 0 ? 
                <>
                {
                  isDate2 ?
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>
                      Type
                    </TableHead>
                    <TableHead>
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  { transactions.map(entry => <TableRow key={entry.id}>
                    <TableCell>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dateTime(new Date(entry.date))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`"text-xs" ${entry.type=='expense' ? "bg-red-500" : ""}`}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>৳{entry.amount}</TableCell>
                  </TableRow>)}              
                 
                </TableBody>
              </Table> : <Loading/>}
              </> : "No Data"
              }
              </>
}
            </CardContent>
            <CardFooter>
                  <div className="flex items-center gap-5 justify-center">
                        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                        <div className="text-sm ">Page {currentPage} of {totalPages}</div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
                      </div>
                  </CardFooter>
          </Card>
        
        </div>
      <div>
      <div className="calendar rounded-md border flex justify-center">
      <Calendar
         mode="single"
         selected={date}
         onSelect={setDate}
        
         />
      </div>
      <Card className="mt-5">
      {monthly ? <Chart {...chartConfig} /> : <Spinner/>}
      </Card>
      </div>
      </main>
    </div>
  );
};

export default Transaction;
