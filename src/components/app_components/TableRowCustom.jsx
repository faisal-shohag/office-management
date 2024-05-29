/* eslint-disable react/prop-types */

import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

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
} from "../ui/alert-dialog";

const TableRowCustom = ({ data, handleDelete, nameFile }) => {
  const { id_no, name, phone, designation, department } = data;

  // console.log(handleDelete);
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Teacher Image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={`http://localhost:5000/image/${nameFile}/${id_no}`}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{id_no}</TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{phone}</TableCell>
      {/* <TableCell className="hidden md:table-cell">
           {present_address}
        </TableCell> */}
      <TableCell className="hidden md:table-cell">{designation}</TableCell>
      <TableCell className="hidden md:table-cell">{department}</TableCell>
      <TableCell>
       
        <div className="flex items-center justify-center gap-3">
          <Link to={`/dashboard/${nameFile}-profile/${id_no}`}>
            <Button>
              <Eye size={20} className="mr-2" /> View
            </Button>
          </Link>
          <Link to={`/dashboard/${nameFile}-edit/${id_no}`}>
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
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete and
                  remove your data from our server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(id_no)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

TableRowCustom.propTypes = {
  teacher: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default TableRowCustom;
