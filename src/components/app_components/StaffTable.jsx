import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import TableRowCustom from "./TableRowCustom";
import { deleteStaff, deleteTeacher } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import Alert from "./Alert";
const StaffTable = ({ staffs }) => {
  const [_staffs, setStaffs] = useState(staffs);

  const handleDelete = (id) => {
    console.log(id);
    toast.promise(
      deleteStaff(id).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete!");
        }
        const s = _staffs.filter((item) => item.id_no != id);
        setStaffs(s);
        return res.json();
      }),
      {
        loading: "Deleting...",
        success: <b>Successfully deleted!</b>,
        error: <b>Failed to delete.</b>,
      }
    );
  };

  return (
    <div>
      {staffs.length == 0 ? (
        <Alert
          title="You have not added any Staff yet!"
          subtitle="Here you can manage staff!"
          link="/dashboard/add-staff"
          linktitle="Add"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
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
            {_staffs.map((staff) => (
              <TableRowCustom
                nameFile="staffs"
                key={staff.id}
                data={staff}
                handleDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

StaffTable.propTypes = {
  staffs: PropTypes.array.isRequired,
};

export default StaffTable;
