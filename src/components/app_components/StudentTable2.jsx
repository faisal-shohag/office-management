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
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { deleteStudent } from "@/lib/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert";
const StudentTable2 = ({ students ,courseClassHandler}) => {
  const [_students, setStudents] = useState(students);
  //  console.log(students)

  const handleDelete = (id) => {
    toast.promise(
      deleteStudent(id).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete!");
        }
        const std = _students.filter((item) => item.id != id);
        setStudents(std);
        courseClassHandler()
        return res.json();
      }),
      {
        loading: "Deleting Student...",
        success: <b>Successfully deleted!</b>,
        error: <b>Failed to delete.</b>,
      }
    );
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
              {/* <TableHead className="hidden md:table-cell">
                  Phone
                </TableHead> */}
              <TableHead className="hidden md:table-cell">Section</TableHead>
              {/* <TableHead className="hidden md:table-cell">
                  Class-Section
                </TableHead> */}
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
                {/* <TableCell className="hidden md:table-cell">
                      {student.phone}
                      </TableCell> */}
                <TableCell className="hidden md:table-cell">
                  {student.section.name}
                </TableCell>
                {/* </TableCell>
                      {student.class && <TableCell>{student.class.name}  {student.section && `- ${student.section.name}`}</TableCell>} */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link to={`/dashboard/student-profile/${student.id_no}`}>
                        {" "}
                        <DropdownMenuItem>View</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(parseInt(student.id_no))}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

StudentTable2.propTypes = {
  students: PropTypes.array.isRequired,
  courseClassHandler: PropTypes.func.isRequired,
};

export default StudentTable2;
