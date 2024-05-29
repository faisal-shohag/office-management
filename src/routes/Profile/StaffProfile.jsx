import { ArrowUpRight, Users } from "lucide-react";

import { TbCurrencyTaka } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { dateTime, formDate, getStaffById, getStudentById, getTeacherById } from "@/lib/api";
// import { Item } from "@radix-ui/react-dropdown-menu";
import Loading from "@/components/app_components/Loading";
import Spinner from "@/components/app_components/Spinner";

const StaffProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [isData, setIsData] = useState(false);
  const [admissionFee, setAdmissionFee] = useState([]);
  const [regularFee, setRegularFee] = useState([]);
  let id = useParams();

  const [totalPaid, setTotalPaid] = useState(0);

  /* Fetch students Data */
  useEffect(() => {
    getStaffById(id.id)
      .then((res) => res.json())
      .then((data) => {
        setTeacher(data);
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
  }, [id]);

  console.log(teacher);
  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        teacher && (
          <div className="">
            <div className="">
              <div className="flex justify-between flex-col-reverse md:flex-row gap-6">
                <div className="w-full md:w-[67%]">
                  <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
                    <Card x-chunk="dashboard-01-chunk-0">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Attendances
                        </CardTitle>
                        <TbCurrencyTaka className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {/* {student.attendance.length} */}
                        </div>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-1">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Payment
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ৳{/*  {totalPaid} */}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* container */}
                  <div className="border mt-4 rounded-md">
                    <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-2">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>Recent transactions.</CardDescription>
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
                            <TableHead>Salary Type</TableHead>
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
                          {/* {
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
                        } */}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="md:w-[33%] w-full rounded-md">
                  <div>
                    <Card
                      className="overflow-hidden"
                      x-chunk="dashboard-05-chunk-4"
                    >
                      <CardHeader className="flex flex-row items-start bg-muted/50">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            {teacher.name}
                          </CardTitle>
                          <CardDescription>
                            {teacher.department}
                          </CardDescription>
                        </div>
                        <div className="ml-auto flex items-center gap-1 border-2 rounded">
                          <img
                            alt="Product image"
                            className="aspect-square rounded-md object-cover "
                            height="64"
                            src={`http://localhost:5000/image/staffs/${teacher.id_no}`}
                            width="64"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 text-sm">
                        <div className="grid gap-3">
                          <ul className="grid gap-3">
                            {/* {
                              (teacher.group != "na") && <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Group
                              </span>
                              <span>
                                {teacher.group}
                              </span>
                            </li>
                            } */}

                            {/*  {
                              (teacher.section) && <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Section / Batch
                              </span>
                              <span>
                                {teacher.section.name}
                              </span>
                            </li>
                            } */}

                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Designation
                              </span>
                              <span>{teacher.designation}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                ID NO
                              </span>
                              <span>{teacher.id_no}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Education
                              </span>
                              <span>{teacher.education}</span>
                            </li>
                          </ul>

                          <Separator className="my-2" />
                          <div className="font-semibold">Personal Details</div>
                          <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Email Address
                              </span>
                              <span>{teacher.email}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Phone Number
                              </span>
                              <span>{teacher.phone}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Gender
                              </span>
                              <span className="uppercase">
                                {teacher.gender}
                              </span>
                            </li>
                          </ul>

                          <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">NID</span>
                              <span>{teacher.nid}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Blood Group
                              </span>
                              <span className="uppercase">
                                {teacher.blood_group}
                              </span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Salary
                              </span>
                              <span>{teacher.fixed_salary} ৳</span>
                            </li>
                          </ul>
                        </div>

                        {/* <Separator className="my-4" />
                        <div className="grid gap-3">
                          <div className="font-semibold">
                            Parents Information
                          </div>
                          <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">
                                Parents Name
                              </dt>
                              <dd>{teacher.parent_name}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">
                                Parents Phone
                              </dt>
                              <dd>
                                <a href="mailto:">{teacher.parent_phone}</a>
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">
                                L-Guardian Name
                              </dt>
                              <dd>
                                <a href="#">{teacher.local_guardian}</a>
                              </dd>
                            </div>
                            <div className="flex items-center justify-between">
                              <dt className="text-muted-foreground">
                                L-Guardian Phone
                              </dt>
                              <dd>
                                <a href="#">{teacher.local_guardian_phone}</a>
                              </dd>
                            </div>
                          </dl>
                        </div> */}
                        <Separator className="my-4" />
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">
                              Joining Date
                            </span>
                            <span>{teacher.joining_date}</span>
                          </li>
                          <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">
                              Present Address
                            </span>
                            <span>{teacher.present_address}</span>
                          </li>

                          <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">
                              Permanent Address
                            </span>
                            <span>{teacher.permanent_address}</span>
                          </li>
                        </ul>
                        <Separator className="my-4" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default StaffProfile;
