import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import TeacherTable from "./TeacherTable";
import StaffTable from "./StaffTable";
const StaffTabContent = ({ title, description, staffs }) => {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <StaffTable staffs={staffs} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

StaffTabContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  staffs: PropTypes.array.isRequired,
};

export default StaffTabContent;
