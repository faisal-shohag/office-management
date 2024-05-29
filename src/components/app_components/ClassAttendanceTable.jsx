import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Alert from "./Alert";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { attendanceUpdate } from "@/lib/api";
const ClassAttendanceTable = ({ students, date, updateAttendanceTable }) => {

  const handleStatus =  (studentId, isPresent, attendanceId, classId, sectionId) => {

    attendanceUpdate({isPresent: !isPresent}, studentId, date, attendanceId)
    .then(res=>res.json())
    .then(data=> {
      console.log(data)
      updateAttendanceTable(classId, date, sectionId)
    })
    .catch(err=> {
      console.log(err)
    })


  };

  return (
    <div>
      {students.length == 0 ? (
        <Alert
          title="No students is admitted to this class/(Section)!"
          subtitle="Add students to see."
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
              <TableHead className="hidden md:table-cell">Status</TableHead>
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

                  <div className="flex items-center space-x-2">
                    <Switch onCheckedChange={()=>{handleStatus(student.id, student.isPresent, student.attendanceId, student.classId, student.sectionId)}} checked={student.isPresent}  id="airplane-mode" />
                    <Label htmlFor="airplane-mode">
                      {student.isPresent ? "Present" : "Absent"}
                    </Label>
                  </div>
                  {/* <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={student.isPresent}
                        className="sr-only peer"
                        // onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                      />
           
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {!student.isPresent ? "Absent" : "Present"}
                      </span>
                    </label>
                  </div> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

ClassAttendanceTable.propTypes = {
  students: PropTypes.array.isRequired,
  date: PropTypes.string.isRequired,
  updateAttendanceTable: PropTypes.func.isRequired
};

export default ClassAttendanceTable;
