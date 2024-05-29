import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import TableRowCustom from "./TableRowCustom";
import { deleteTeacher } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import Alert from "./Alert";
const TeacherTable = ({ teachers }) => {
  const [_teachers, setTeachers] = useState(teachers);

  const handleDelete = (id) => {
    toast.promise(
      deleteTeacher(id).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete!");
        }
        const t = _teachers.filter((item) => item.id_no != id);
        setTeachers(t);
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
      {teachers.length == 0 ? (
        <Alert
          title="You have not added any Teacher yet!"
          subtitle="Here you can manage teachers!"
          link="/dashboard/add-teachers"
          linktitle="Add"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              {/* <TableHead className="hidden md:table-cell">Address</TableHead> */}
              <TableHead className="hidden md:table-cell">
                Designation
              </TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {_teachers.map((teacher) => (
              <TableRowCustom
                nameFile="teachers"
                key={teacher.id}
                data={teacher}
                handleDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

TeacherTable.propTypes = {
  teachers: PropTypes.array.isRequired,
};

export default TeacherTable;
