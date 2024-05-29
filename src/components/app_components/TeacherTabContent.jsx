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
const TeacherTabContent = ({ title, description, teachers }) => {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TeacherTable teachers={teachers} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

TeacherTabContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  teachers: PropTypes.array.isRequired,
};

export default TeacherTabContent;
