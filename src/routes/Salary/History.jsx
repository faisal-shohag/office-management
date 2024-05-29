/* eslint-disable react/prop-types */
import {
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
import { dateTime, deleteSalary } from "@/lib/api";
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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import Alert from "@/components/app_components/Alert";

const History = ({ data}) => {
  /* Delete Tans */
  const handleDelete = (id) => {
    toast.promise(
      deleteSalary(id).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete!");
        }
        //loadingFunction()
        window.location.reload();
        return res.json();
      }),
      {
        loading: "Deleting ...",
        success: <b>Successfully deleted!</b>,
        error: <b>Failed to delete.</b>,
      }
    );
    //feeDataHandler()
  };
  return (
    <div>
      <div className="border mt-4 rounded-md">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent transactions.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {data.length == 0 ? (
            <Alert
              title="No Data Found!"
              //subtitle="Add Teacher or Staff first!"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salary Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {dateTime(new Date(item.paid_date))}
                      </TableCell>
                      <TableCell className="text-right">
                        ৳ {item.monthly_salary + item.bonus}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <Trash size={20} className="mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete and remove your data from our
                                server.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default History;
