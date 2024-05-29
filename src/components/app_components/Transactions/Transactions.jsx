/* eslint-disable react/prop-types */
import{ useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { dateTime, getStudentById } from "@/lib/api";
const Transactions = ({getData}) => {
  const [student, setStudent] = useState(null);
  const [isData, setIsData] = useState(false);
  const [admissionFee, setAdmissionFee] = useState([]);
  const [regularFee, setRegularFee] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    getStudentById(getData)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setIsData(true);

        setAdmissionFee(data.admissionFee);
        setRegularFee(data.regularFee);

        let total = 0;
        for (let i = 0; i < data.admissionFee.length; i++) {
          let fee = data.admissionFee[i];
          total += fee.fee + fee.other - fee.discount;
        }

        for (let i = 0; i < data.regularFee.length; i++) {
          total += data.regularFee[i].total;
        }
        setTotalPaid(total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getData]);
  console.log(student);
  return (
    <div>
       <div className="border mt-4 rounded-md">
                    <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-2">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                          Recent transactions.
                        </CardDescription>
                      </div>
                      {/* <Button asChild size="sm" className="ml-auto gap-1">
                        <Link to="#">
                          View All
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button> */}
                    </CardHeader>
                    <CardContent>
                       <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fee Type</TableHead>
                            {/* <TableHead className="hidden xl:table-column">
                              Type
                            </TableHead> */}
                            {/* <TableHead className="hidden xl:table-column">
                              Status
                            </TableHead> */}
                            {/* <TableHead className="hidden xl:table-column">
                              Date
                            </TableHead> */}
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                        {
                          admissionFee.map(fee=>
                            <TableRow key={fee.id}>
                            <TableCell>
                              <div className="font-medium">Admission Fee</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {dateTime(new Date(fee.collectionDate))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              ৳{(fee.fee + fee.other) - fee.discount}
                            </TableCell>
                          </TableRow>
                          )
                        }

                        {
                          regularFee.map(fee=>
                            <TableRow key={fee.id}>
                            <TableCell>
                              <div className="font-medium">Regular Fee</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {dateTime(new Date(fee.collectionDate))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              ৳{fee.total}
                            </TableCell>
                          </TableRow>
                          )
                        }
                        </TableBody>
                      </Table>
                     
                    </CardContent>
                  </div>
    </div>
  );
};

export default Transactions;
