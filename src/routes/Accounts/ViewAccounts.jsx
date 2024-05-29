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
} from "@/components/ui/alert-dialog"

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
import { dateTime, deleteAccounts, getAccounts } from "@/lib/api";
import toast from "react-hot-toast";
import Alert from "@/components/app_components/Alert";
import Loading from "@/components/app_components/Loading";
const ViewAccounts = ({ dataLoad, setDataLoad }) => {

  const [isData, setIsData] = useState(false)


  const [account, setAccount] = useState([]);
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
               { isData ?  <> 
                {(!account  && account.length == 0 ) ? (
                  <Alert title="No data found!" />
                ) : (
          
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="lg:block md:hidden">In</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {account.map((item) => {
                        return (
                          <>
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                {item.purpose}
                              </TableCell>
                              <TableCell>{item.type}</TableCell>
                              <TableCell className="lg:block md:hidden">{item.transaction_type}</TableCell>
                              <TableCell>{item.amount}</TableCell>
                              <div className="flex items-center">
                                <TableCell>
                                  {dateTime(new Date(item.date))}
                                </TableCell>
                              </div>
                              <TableCell className="gap-2">
                                {/* <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                   
                                   
                                    <DropdownMenuItem>  <ShowDialog name="Delete" title="Delete Accoount" message="Are you sure?" isOpen={isOpen} openModal={openModal} closeModal={closeModal} handler={()=>deleteHandler(item.id)} buttonText="Delete"/> </DropdownMenuItem>
                                  
                                   
                                  </DropdownMenuContent>
                                </DropdownMenu> */}
                                <div className="grid lg:grid-cols-2 gap-2 md:grid-cols-1">
                                {/* <Button>Edit</Button> */}
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button className="" variant="destructive">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete your
                                      account and remove your data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={()=> deleteHandler(item.id)}>Delete</AlertDialogAction>
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
                </> : <Loading/> }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </TooltipProvider>
  );
};

export default ViewAccounts;
