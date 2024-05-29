/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
import { Button } from "../ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { deleteStudent } from "@/lib/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert";
const StudentTable = ({ students, studentFetchHandler }) => {
  //  const [_students, setStudents] = useState(students)

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      toast.promise(
        deleteStudent(id).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete!");
          }
          // const std = _students.filter((item) => item.id != id);
          // setStudents(std);
          studentFetchHandler();
          return res.json();
        }),
        {
          loading: "Deleting Student...",
          success: <b>Successfully deleted!</b>,
          error: <b>Failed to delete.</b>,
        }
      );
    }
  };

  return (
    <div>
      {students.length == 0 ? (
        <Alert
          title="You have not added any Students yet!"
          subtitle="Here you can manage students!"
          link="/dashboard/add-students"
          linktitle="Add"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>ID No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead className="hidden md:table-cell">
                Course-Batch
              </TableHead>
              <TableHead className="hidden md:table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.email}>
                <TableCell className="hidden sm:table-cell">
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={`http://localhost:5000/image/students/${student.id_no}`}
                    width="64"
                  />
                  {/* <ImageView imageUrl={`http://localhost:5000/image/students/${student.id_no}`} defaultImageUrl="https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg"/> */}
                </TableCell>
                <TableCell className="font-medium">{student.id_no}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {student.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {student.phone}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {student.present_address}
                </TableCell>
                {student.class && (
                  <TableCell>
                    {student.class.name}{" "}
                    {student.section && `- ${student.section.name}`}
                  </TableCell>
                )}
                <TableCell>
                  <div>
                    <div className="flex items-center justify-center gap-3">
                      <Link to={`/dashboard/student-profile/${student.id_no}`}>
                        <Button>
                          <Eye size={20} className="mr-2" /> View
                        </Button>
                      </Link>
                      <Link to={`/dashboard/editStudent/${student.id_no}`}>
                        <Button>
                          <Edit size={20} className="mr-2" /> Edit
                        </Button>
                      </Link>

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
                              onClick={() => handleDelete(student.id_no)}
                            >
                              Delete
                            </AlertDialogAction>
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
      )}
    </div>
  );
};

StudentTable.propTypes = {
  students: PropTypes.array.isRequired,
};

export default StudentTable;
