import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { useContext, useEffect, useState } from "react";
import {
  dateTime,
  fetchImageAndConvertToDataURI,
  getCount,
  getTeacherOrStaffById,
  SalaryAdd,
} from "@/lib/api";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { DownloadIcon, Search } from "lucide-react";
import { AuthContext } from "@/Providers/AuthProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import generatePDF, { Margin, Resolution, usePDF } from "react-to-pdf";

import Alert from "@/components/app_components/Alert";
const PaySalary = () => {
  const { admin } = useContext(AuthContext);
  const { targetRef } = usePDF();

  const { register, handleSubmit, setValue } = useForm();
  const [employee, setEmployee] = useState(null);
  const [isData, setIsData] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [bonus, setBonus] = useState(0);
  const [employeeType, setEmployeeType] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isDownload, setIsDownload] = useState(false)

  /* Check Student */
  const [checkData, setCheckData] = useState([]);
  useEffect(() => {
    getCount()
      .then((res) => res.json())
      .then((data) => setCheckData(data));
  }, [setCheckData]);

  //const [dataLoad,SetLoadData] = useState(false)

  const [imageDataURI, setImageDataURI] = useState(null);

  const feeDataHandler = (e) => {
    e.preventDefault();
    setEmployeeType(e.target.employee.value);

    toast.promise(
      getTeacherOrStaffById(e.target.id_no.value, e.target.employee.value)
        .then((res) => res.json())
        .then((data) => {
          if (!data) {
            throw new Error("Employee not Found!");
          }
          setValue("monthly_salary", data.fixed_salary);
          setEmployee(data);
          setEmployeeId(data.id);
          setIsData(true);
          setBtnDisabled(false);
          setIsDownload(true)
        }),
      {
        loading: "Searching....",
        success: <b>Found!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );

    const loadImageDataURI = async () => {
      const logoURI = await fetchImageAndConvertToDataURI("inst", "logo");
      setImageDataURI(logoURI);
    };

    loadImageDataURI();
  };

  /* Staff Pay Salary */
  const onSubmit = (data) => {
    console.log(data);
    if (employeeType == "staff") {
      data = {
        monthly_salary: parseFloat(data.monthly_salary),
        bonus: parseFloat(data.bonus) ? parseFloat(data.bonus) : 0,
        staffId: employeeId,
        paid_date: data.paid_date,
      };
      toast.promise(
        SalaryAdd(data, "Staff")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setBtnDisabled(true);
            //loadingFunction()
            if (data.err) {
              throw new Error(data.err);
            }
          }),
        {
          loading: "Paying....",
          success: <b>Fee added successfully!</b>,
          error: (error) => <b>{error.message}</b>,
        }
      );
    } else {
      data = {
        monthly_salary: parseFloat(data.monthly_salary),
        bonus: parseFloat(data.bonus) ? parseFloat(data.bonus) : 0,
        teacherId: employeeId,
        paid_date: data.paid_date,
      };
      /* Teacher Staff Salary Add */
      toast.promise(
        SalaryAdd(data, "Teacher")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setBtnDisabled(true);
            if (data.err) {
              throw new Error(data.err);
            }
          }),
        {
          loading: "Searching....",
          success: <b>Fee added successfully!</b>,
          error: (error) => <b>{error.message}</b>,
        }
      );
    }
  };

  const downloadPaySlip = () => {
    generatePDF(targetRef, {
      filename: `Payment Reciept.pdf`,
      method: open,
      resolution: Resolution.HIGH,
      page: {
        margin: Margin.SMALL,
      },
    });
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold mb-3">Pay Salary</h1>
          {checkData.teacher != 0 || checkData.staff != 0 ? (
            <div className="flex justify-between">
            <form
              className="mb-5 flex items-center gap-2"
              onSubmit={feeDataHandler}
            >
              <Input
                className="max-w-[200px]"
                type="text"
                id="id"
                name="id_no"
                placeholder="ID"
              />

              <label htmlFor="type">
                <Select id="type" name="employee" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Employee</SelectLabel>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>

              <Button size="sm">
                <Search size={18} /> <span className="ml-2">Search</span>
              </Button>
            </form>
             {isDownload &&  <Button onClick={downloadPaySlip} variant="destructive"><DownloadIcon className="mr-2" size={18}/> Download Reciept</Button>}
            </div>
          ) : (
            <Alert
              title="You have not added any Teacher or Staff yet!"
              subtitle="Add Teacher or Staff first!"
            />
          )}
          {isData && employee && (
            <div>
              <form
                className="border p-5 rounded-lg"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-3 gap-3">
                  <label htmlFor="Name" className="md:col-span-1">
                    Monthly Salary
                    <Input
                      {...register("monthly_salary", { required: true })}
                      type="number"
                      name="monthly_salary"
                      required
                      placeholder="Monthly Salary"
                      //value={employee.fixed_salary}
                      disabled
                    />
                  </label>
                  <label htmlFor="Mobile Number" className="md:col-span-1">
                    Bonus
                    <Input
                      {...register("bonus")}
                      onChange={(e) =>
                        setBonus(
                          !e.target.value == "" ? parseFloat(e.target.value) : 0
                        )
                      }
                      type="number"
                      name="bonus"
                      placeholder="Bonus"
                    />
                  </label>
                  <label htmlFor="Assign Teacher" className="md:col-span-1">
                    Date
                    <Input
                      type="date"
                      name="paid_date"
                      {...register("paid_date", { required: true })}
                    />
                  </label>
                </div>
                <Button disabled={btnDisabled} size="sm" className="mt-5">
                  Submit
                </Button>
              </form>
             
            </div>
          )}
        </div>
        {isData && employee && (
          <div >
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="flex flex-col items-center w-full">
                  <img className="h-10" src={imageDataURI}></img>
                  {admin && (
                    <div className="mt-3 text-center">
                      {/*  <div className="font-bold text-xl">{admin.inst_name}</div> */}
                      <div className="font-bold text-sm">
                        EIIN: {admin.inst_eiin}
                      </div>
                      <CardDescription>
                        Date: {dateTime(new Date())}
                      </CardDescription>
                      <div className="font-bold mt-2">
                        Payment Money Reciept
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className=" text-sm">
                <div className="grid gap-3">
                  <Separator className="my-2" />
                  <div className="font-semibold">Employee Information</div>
                  <ul className="grid gap-3 font-semibold">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Employee Name
                      </span>
                      <span>{employee.name}</span>
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Instructor Id No
                      </span>
                      <span>{employee.id_no}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Fees</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Monthly Salary</dt>
                      <dd className="font-semibold">
                        {employee.fixed_salary.toString().padStart(2, "0")} ৳
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Bonus</dt>
                      <dd className="font-semibold">
                        {bonus.toString().padStart(2, "0")} ৳
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground font-bold">
                    Paying This Time (৳)
                  </dt>
                  <dd className="font-bold">
                    {employee.fixed_salary + bonus}৳
                  </dd>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
      <div>
        
{isData && employee && (
          <div ref={targetRef}>
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="flex flex-col items-center w-full">
                  <img className="h-24" src={imageDataURI}></img>
                  {admin && (
                    <div className="mt-3 text-center">
                      {/*  <div className="font-bold text-xl">{admin.inst_name}</div> */}
                      <div className="font-bold text-2xl">
                        EIIN: {admin.inst_eiin}
                      </div>
                      <CardDescription className="text-xl">
                        Date: {dateTime(new Date())}
                      </CardDescription>
                      <div className="font-bold mt-2 text-4xl">
                        Salary Money Reciept
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className=" text-3xl">
                <div className="grid gap-3 ">
                  <Separator className="my-2" />
                  <div className="font-semibold">Employee Information</div>
                  <ul className="grid gap-3 font-semibold">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Employee Name
                      </span>
                      <span>{employee.name}</span>
                    </li>
                    <Separator className="my-2" />

                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Employee ID No
                      </span>
                      <span>{employee.id_no}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Fees</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Monthly Salary</dt>
                      <dd className="font-semibold">
                        {employee.fixed_salary.toString().padStart(2, "0")} ৳
                      </dd>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Bonus</dt>
                      <dd className="font-semibold">
                        {bonus.toString().padStart(2, "0")} ৳
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground font-bold">
                    Paying This Time (৳)
                  </dt>
                  <dd className="font-bold">
                    {employee.fixed_salary + bonus}৳
                  </dd>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default PaySalary;
