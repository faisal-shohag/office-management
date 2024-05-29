import {
  Edit,
  Eye,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import Loading from "@/components/app_components/Loading";
import { deleteClass, getClasses } from "@/lib/api";
import Alert from "@/components/app_components/Alert";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [isData, setIsData] = useState(false);

  useEffect(() => {
    getClasses()
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setClasses(data);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /* Delete Class */
  const deleteHandler = (id) => {
    toast.promise(
      deleteClass(id).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete!");
        }
        const cls = classes.filter((item) => item.id != id);
        setClasses(cls);
        return res.json();
      }),
      {
        loading: "Deleting Class...",
        success: <b>Successfully deleted!</b>,
        error: <b>Failed to delete.</b>,
      }
    );
  };
  /* Edit Class */
  const navigate = useNavigate();

  const editHandler = (id) => {
    navigate(`../editClass/${id}`);
  };

  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        <TooltipProvider>
          <main className="">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                 {/*  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Export
                    </span>
                  </Button> */}
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <Link
                      to="/dashboard/add-classes"
                      className="sr-only sm:not-sr-only sm:whitespace-nowrap"
                    >
                      Add Course
                    </Link>
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Courses</CardTitle>
                    <CardDescription>Manage your courses here.</CardDescription>
                  </CardHeader>
                  {classes.length == 0 ? (
                    <Alert
                      title="No course is added yet!"
                      subtitle="You can manage courses after adding them."
                      link="/dashboard/add-classes"
                      linktitle="Add"
                    />
                  ) : (
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead>Batch</TableHead>
                            {/* <TableHead>Subject(s)</TableHead> */}
                            <TableHead>Course Fee</TableHead>
                            {/* <TableHead className="hidden md:table-cell">
                        Assigned Teacher
                      </TableHead> */}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classes.map((cls) => (
                            <TableRow key={cls.id}>
                              <TableCell className="font-medium">
                                <div className="">{cls.name}</div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {cls.sections.length == 0 ? (
                                  <Badge variant="destructive">N/A</Badge>
                                ) : (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {cls.sections.map((sc) => (
                                      <Badge key={sc.id}>{sc.name}</Badge>
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                              {/* {cls.subject && (
                                <TableCell>
                                  <div className="font-bold text-md">
                                    {cls.subject.length}
                                  </div>
                                </TableCell>
                              )} */}
                              <TableCell>
                                <div className="font-bold text-md">
                                  {cls.fee} ৳
                                </div>
                              </TableCell>
                              {/* <TableCell className="hidden md:table-cell">
                        Laser Lemonade
                      </TableCell> */}
                              <TableCell>
                                {/* <div className="block lg:hidden">
                                  <DropdownMenu>
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
                                      <Link
                                        to={`/dashboard/class-view/${cls.id}`}
                                      >
                                        <DropdownMenuItem>
                                          View
                                        </DropdownMenuItem>
                                      </Link>
                                      <DropdownMenuItem
                                        onClick={() => editHandler(cls.id)}
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => deleteHandler(cls.id)}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div> */}
                                <div >
                                  <div className="flex items-center justify-center gap-3">
                                    <Link
                                      to={`/class-view/${cls.id}`}
                                    >
                                      <Button>
                                        <Eye size={20} className="mr-2" /> View
                                      </Button>
                                    </Link>
                                    <Button onClick={() => editHandler(cls.id)}>
                                      <Edit size={20} className="mr-2" /> Edit
                                    </Button>
                                   

                                    <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button
                                    
                                      variant="destructive"
                                    >
                                      <Trash size={20} className="mr-2" />
                                      Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete and remove your data from our server.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={()=> deleteHandler(cls.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </TooltipProvider>
      )}
    </>
  );
}
