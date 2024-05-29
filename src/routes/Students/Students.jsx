import { File, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { viewStudentsData } from "@/lib/api";
import StudentTable from "@/components/app_components/StudentTable";
import Loading from "@/components/app_components/Loading";
import Alert from "@/components/app_components/Alert";
import { Input } from "@/components/ui/input";

const api_key = import.meta.env.VITE_apiKey;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isData, setIsData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");

  /* Fetch students Data */
  const studentFetchHandler = () => {
    viewStudentsData()
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setStudents(data);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${api_key}students_per_page?page=${currentPage}&limit=${limit}&search=${search}`
        );
        const data = await response.json();
        // console.log(data);
        setStudents(data.students);
        setTotalPages(data.totalPages);
        setIsData(true);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [currentPage, search]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setIsData(false);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setIsData(false);
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchChange = (event) => {
    setIsData(false);
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  return (
    <>
      <TooltipProvider>
        <main className="">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <div className="flex border rounded-md pl-3 gap-2 justify-center items-center">
                  <Search className="text-muted-foreground" size={20} />
                  <Input
                    onChange={handleSearchChange}
                    value={search}
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 outline-none border-none focus:outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Search..."
                  />
                </div>

                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <Link
                    to="/dashboard/add-students"
                    className="sr-only sm:not-sr-only sm:whitespace-nowrap"
                  >
                    Add Students
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>Manage your students here.</CardDescription>
                </CardHeader>
                {!isData ? (
                  <Loading />
                ) : (
                  <CardContent>
                    {students.length == 0 ? (
                      <Alert
                        title="You have not added any Students yet!"
                        subtitle="Here you can manage students!"
                        link="/dashboard/add-students"
                        linktitle="Add"
                      />
                    ) : (
                      <StudentTable
                        studentFetchHandler={studentFetchHandler}
                        students={students}
                      />
                    )}
                  </CardContent>
                )}
                <CardFooter>
                  <div className="flex items-center gap-5 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm ">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </TooltipProvider>
    </>
  );
}
