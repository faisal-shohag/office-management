import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewAccounts from "./ViewAccounts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { accountsAdd } from "@/lib/api";
import toast from "react-hot-toast";
const AddAccounts = () => {
 

  const [dataLoad, setDataLoad] = useState(true);
  const [checkType, setCheckType] = useState("");
 
  const {
    register,
    handleSubmit,
    setValue,
    // reset
  } = useForm();

  /* Submit Accounts Data */
  const onSubmit = (data) => {
    // final Data
    data = {
      ...data,
      date: new Date(data.date),
      amount: parseInt(data.amount),
    };

    toast.promise(
      accountsAdd(data)
        .then((res) => res.json())
        .then((data) => {
          setDataLoad(data);
          if (data.err) {
            throw new Error("Something went wrong!");
          }
        }),
      {
        loading: "Adding to account....",
        success: <b>Added successfully!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );

  }

  // console.log(checkType);
  return (
    <>
      {" "}
      <div style={{ overflow: "hidden" }}>
        <h1 className="text-2xl font-bold mb-3">Add to Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="border p-5 rounded">
          <div className="grid grid-cols-1 md:grid-cols-6 mt-3 gap-4">
            <label htmlFor="Name" className="md:col-span-1">
              Name of purpose
              <Input
                type="text"
                name="purpose"
                placeholder="Name Of Purpose"
                {...register("purpose", { required: true })}
              />
            </label>
            <label htmlFor="Tuition Fee" className="md:col-span-1">
              Type
              <Select
                onValueChange={(value) => setValue("type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Type</SelectLabel>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
            <label htmlFor="Tuition Fee" className="md:col-span-1">
              Transactions type
              <Select
                onValueChange={(value) => {
                  setCheckType(value);
                  setValue("transaction_type", value);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Transactions Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Type</SelectLabel>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
            {checkType == "Check" ? (
              <label htmlFor="Name" className="md:col-span-1">
                Check Number
                <Input
                  type="number"
                  name="amount"
                  placeholder="Check Number "
                  {...register("check_number", { required: true })}
                />
              </label>
            ) : (
              ""
            )}
            <label htmlFor="Name" className="md:col-span-1">
              Amount
              <Input
                type="number"
                name="amount"
                placeholder="Amount"
                {...register("amount", { required: true })}
              />
            </label>
            <label htmlFor="Assign Teacher" className="md:col-span-1">
              Date
              <Input
                type="date"
                name="date"
                {...register("date", { required: true })}
              />
            </label>
          </div>
          <Button size="sm" className="h-8 gap-1 mt-5">
            Add Accounts
          </Button>
        </form>
      </div>
      {/* View Account */}
      <ViewAccounts dataLoad={dataLoad} />
    </>
  );
};

export default AddAccounts;
