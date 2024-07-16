/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import {
  accountUpdate,
  dateTime,
  deleteAccounts,
  getAccounts,
} from "@/lib/api";
import toast from "react-hot-toast";
import Alert from "@/components/app_components/Alert";
import Loading from "@/components/app_components/Loading";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ViewAccounts = ({ dataLoad, setDataLoad }) => {
  const [isData, setIsData] = useState(false);
  const [account, setAccount] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm();

  const [checkType, setCheckType] = useState("");

  /* Get Account Data */
  useEffect(() => {
    getAccounts()
      .then((res) => res.json())
      .then((data) => {
        setAccount(data);
        setIsData(true);
        //setDataLoad(false);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
        //setDataLoad(false); // Make sure to set dataLoad to false even if there's an error
      });
  }, [dataLoad]);

  /* Delete Class */
  const deleteHandler = (id) => {
    toast.promise(
      deleteAccounts(id).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete!");
        }
        const acnt = account.filter((item) => item.id != id);
        setAccount(acnt);
        return res.json();
      }),
      {
        loading: "Deleting Class...",
        success: <b>Successfully deleted!</b>,
        error: <b>Failed to delete.</b>,
      }
    );
  };

  const [id, setId] = useState(null);

  const handleGetEditedData = (index, id) => {
    setId(id);
    setValue("purpose", account[index].purpose);
    setValue("type", account[index].type);
    setValue("transaction_type", account[index].transaction_type);
    setValue("amount", account[index].amount);
    setValue("date", account[index].date);
  };
  const onSubmit = (data) => {
    // final Data
    data = {
      ...data,
      date: new Date(data.date),
      amount: parseInt(data.amount),
    };

    console.log(data);

    toast.promise(
      accountUpdate(data, id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.err) {
            throw new Error("Something went wrong!");
          }
          window.location.reload()
        }),
      {
        loading: "Updating account....You may need to refresh!",
        success: <b>Updated successfully!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

  return (
    <TooltipProvider>
      <main className="">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>

              <CardContent>
                {isData ? (
                  <>
                    {!account && account.length == 0 ? (
                      <Alert title="No data found!" />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="lg:block md:hidden">
                              In
                            </TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {account.map((item, index) => {
                            return (
                              <>
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">
                                    {item.purpose}
                                  </TableCell>
                                  <TableCell>{item.type}</TableCell>
                                  <TableCell className="lg:block md:hidden">
                                    {item.transaction_type}
                                  </TableCell>
                                  <TableCell>{item.amount}</TableCell>
                                  <div className="flex items-center">
                                    <TableCell>
                                      {dateTime(new Date(item.date))}
                                    </TableCell>
                                  </div>
                                  <TableCell className="gap-2">
                                    <div className="grid grid-cols-2 gap-2 ">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            className=""
                                            variant="destructive"
                                          >
                                            Delete
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This action cannot be undone. This
                                              will permanently delete your
                                              account and remove your data from
                                              our servers.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                deleteHandler(item.id)
                                              }
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>

                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            onClick={() =>
                                              handleGetEditedData(
                                                index,
                                                item.id
                                              )
                                            }
                                            className=""
                                            variant=""
                                          >
                                            Edit
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Edit account
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              <form
                                                onSubmit={handleSubmit(
                                                  onSubmit
                                                )}
                                                className="grid grid-cols-1 gap-3"
                                              >
                                                <div>
                                                  <label htmlFor="purpose">
                                                    Purpose
                                                  </label>
                                                  <Input
                                                    type="text"
                                                    placeholder="Purpose"
                                                    id="purpose"
                                                    name="purpose"
                                                    {...register("purpose", {
                                                      required: true,
                                                    })}
                                                  />
                                                </div>
                                                <label
                                                  htmlFor="Tuition Fee"
                                                  className="md:col-span-1"
                                                >
                                                  Type
                                                  <Select
                                                    onValueChange={(value) =>
                                                      setValue("type", value)
                                                    }
                                                    required
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel>
                                                          Select Type
                                                        </SelectLabel>
                                                        <SelectItem value="income">
                                                          Income
                                                        </SelectItem>
                                                        <SelectItem value="expense">
                                                          Expense
                                                        </SelectItem>
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </label>
                                                <label
                                                  htmlFor="transaction_type"
                                                  className="md:col-span-1"
                                                >
                                                  Transactions type
                                                  <Select
                                                    onValueChange={(value) => {
                                                      setCheckType(value);
                                                      setValue(
                                                        "transaction_type",
                                                        value
                                                      );
                                                    }}
                                                    required
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Select Transactions Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectLabel>
                                                          Select Type
                                                        </SelectLabel>
                                                        <SelectItem value="Cash">
                                                          Cash
                                                        </SelectItem>
                                                        <SelectItem value="Check">
                                                          Check
                                                        </SelectItem>
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </label>

                                                {checkType == "Check" ? (
                                                  <label
                                                    htmlFor="Name"
                                                    className="md:col-span-1"
                                                  >
                                                    Check Number
                                                    <Input
                                                      type="number"
                                                      name="amount"
                                                      placeholder="Check Number "
                                                      {...register(
                                                        "check_number",
                                                        { required: true }
                                                      )}
                                                    />
                                                  </label>
                                                ) : (
                                                  ""
                                                )}

                                                <label
                                                  htmlFor="Name"
                                                  className="md:col-span-1"
                                                >
                                                  Amount
                                                  <Input
                                                    type="number"
                                                    name="amount"
                                                    placeholder="Amount"
                                                    {...register("amount", {
                                                      required: true,
                                                    })}
                                                  />
                                                </label>
                                                <label
                                                  htmlFor="Assign Teacher"
                                                  className="md:col-span-1"
                                                >
                                                  Date
                                                  <Input
                                                    type="date"
                                                    name="date"
                                                    {...register("date", {
                                                      required: true,
                                                    })}
                                                  />
                                                </label>

                                                <label
                                                  htmlFor="incharge"
                                                  className="md:col-span-1"
                                                >
                                                  Added by
                                                  <Input
                                                    {...register("incharge")}
                                                    type="text"
                                                    required
                                                    name="incharge"
                                                    placeholder="Added by "
                                                  />
                                                </label>
                                                <Button
                                             
                                            type="submit">
                                              Save
                                            </Button>
                                              </form>
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                          
                                            
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </>
                ) : (
                  <Loading />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </TooltipProvider>
  );
};

export default ViewAccounts;
