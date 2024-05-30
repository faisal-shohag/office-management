import { FaChalkboardTeacher } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiStudent } from "react-icons/pi";
import { MdOutlineSafetyDivider } from "react-icons/md";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClassById } from "@/lib/api";
import Loading from "@/components/app_components/Loading";
// import StudentTable from "@/components/app_components/StudentTable";
import TeacherTable from "@/components/app_components/TeacherTable";
import StudentTable2 from "@/components/app_components/StudentTable2";

const ClassView = () => {
  const param = useParams()

  const [_class, setClass] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [students2, setStudents2] = useState([]);

  /* Fetch Class/Course Data */
  const courseClassHandler = () => {
    getClassById(param.id)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setClass(data);
        let t = [];
        for (let i = 0; i < data.teachers.length; i++) {
          t.push(data.teachers[i].teacher);
        }
        setTeachers(t);

        let s = [];
        for (let i = 0; i < data.student.length; i++) {
          s.push(data.student[i]);
        }
        // console.log(data)
        setStudents(s);
        setStudents2(s);
        // console.log(s)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getClassById(param.id)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setClass(data);
        let t = [];
        for (let i = 0; i < data.teachers.length; i++) {
          t.push(data.teachers[i].teacher);
        }
        setTeachers(t);

        let s = [];
        for (let i = 0; i < data.student.length; i++) {
          s.push(data.student[i]);
        }
        // console.log(data)
        setStudents(s);
        setStudents2(s);
        // console.log(s)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [param]);

  // console.log(students2)

  const filterStudent = (sectionId) => {
    console.log(sectionId);
    if (sectionId == 0) {
      setStudents(students2);
      return;
    }
    const std = students2.filter((s) => s.sectionId == sectionId);
    console.log(std);
    setStudents([...std]);
  };

  // console.log(students);

  return (
    <div>
      {_class ? (
        <main className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold mb-3 border-2 p-3 rounded">
            {_class.name}
          </h1>
          <div className="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Teachers
                </CardTitle>
                <FaChalkboardTeacher className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {_class.teachers.length}
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <PiStudent className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {_class.student.length}
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Batches
                </CardTitle>
                <MdOutlineSafetyDivider className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {_class.sections.length}
                </div>
              </CardContent>
            </Card>
          </div>
          <hr></hr>
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-4">
            <TooltipProvider>
              <main>
                <h1 className="text-xl font-bold mb-3">Students</h1>
                <Tabs defaultValue="all">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger onClick={() => filterStudent(0)} value="all">
                        All
                      </TabsTrigger>
                      {_class.sections.map((sec) => (
                        <div key={sec.id}>
                          <TabsTrigger
                            onClick={() => filterStudent(sec.id)}
                            value={sec.id}
                          >
                            {sec.name}
                          </TabsTrigger>
                        </div>
                      ))}
                    </TabsList>
                  </div>{" "}
                  <br></br>
                  {/* <TabsContent > */}
                  <Card x-chunk="dashboard-06-chunk-0">
                    <CardContent>
                      <StudentTable2 courseClassHandler={courseClassHandler} students={students} />
                    </CardContent>
                  </Card>
                  {/* </TabsContent> */}
                </Tabs>
              </main>
            </TooltipProvider>
            <TooltipProvider>
              <main className="">
                <h1 className="text-xl font-bold mb-3">Teachers</h1>
                <Tabs defaultValue="all">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                  </div>{" "}
                  <br></br>
                  {/* <TabsContent value="all"> */}
                  <Card x-chunk="dashboard-06-chunk-0">
                    <CardContent>
                      <TeacherTable teachers={teachers} />
                    </CardContent>
                  </Card>
                  {/*  </TabsContent> */}
                </Tabs>
              </main>
            </TooltipProvider>
          </div>
        </main>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ClassView;
