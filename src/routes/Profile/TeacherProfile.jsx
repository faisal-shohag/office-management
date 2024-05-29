/* eslint-disable react-hooks/exhaustive-deps */
// import { ArrowUpRight, Users } from "lucide-react";

import { TbCurrencyTaka } from "react-icons/tb";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getTeacherById } from "@/lib/api";
// import { Item } from "@radix-ui/react-dropdown-menu";
import Loading from "@/components/app_components/Loading";
import { Users } from "lucide-react";
import History from "../Salary/History";
// import Spinner from "@/components/app_components/Spinner";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [isData, setIsData] = useState(false);
  const [totalSalary, setTotalSalary] = useState(0);
  // const [admissionFee, setAdmissionFee] = useState([]);
  // const [regularFee, setRegularFee] = useState([]);
  let id = useParams();

  useEffect(() => {
    getTeacherById(id.id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTeacher(data);
        setIsData(true);
        // Calculate total monthly salary including bonuses
        let totalMonthlySalary = 0;
        data.salary.forEach((entry) => {
          totalMonthlySalary += entry.monthly_salary + entry.bonus;
        });
        setTotalSalary(totalMonthlySalary);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          Coming Soon ...
                          {/* {student.attendance.length} */}
                        </div>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-1">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Payment
                        </CardTitle>
                        <TbCurrencyTaka className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ৳ {totalSalary}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trans History */}
                  <History data={teacher.salary} />
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
                            src={`http://localhost:5000/image/teachers/${teacher.id_no}`}
                            width="64"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 text-sm">
                        <div className="grid gap-3">
                          <ul className="grid gap-3">
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
                            <span>{teacher.parmanent_address}</span>
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

export default TeacherProfile;
