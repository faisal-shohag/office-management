import Alert from "@/components/app_components/Alert";
import ClassAttendanceTable from "@/components/app_components/ClassAttendanceTable";
import Loading from "@/components/app_components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getClasses,
  getStudentsByClassAndSection,
  setClassAbsent,
} from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

const AddAttendance = () => {
  const { register, handleSubmit, setValue } = useForm();

  const [classes, setClasses] = useState([]);
  const [isData, setIsData] = useState(false);
  const [isData2, setIsData2] = useState(false);
  const [cands, setCandS] = useState([]);

  const [students, setStudents] = useState([]);

  const [aDate, setADate] = useState(null)

  const setAttendanceByDate = (students, classId, date, sectionId) => {
    console.log(students)
    setClassAbsent(students)
    .then(res=> res.json())
    .then(data=> {
      console.log(data)
      if(!data.err) {
        getClassAttendanceByDate(classId, date, sectionId)
      }
    })
    .catch(err=> {
      console.log(err)
    })

  }

  const getClassAttendanceByDate = async(classId, date, sectionId) => {
    console.log(date)
    try {
      const response = await fetch(import.meta.env.VITE_apiKey + `class/attendance/${classId}/${date}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }
      const data = await response.json()
    const _students = data.map(item => {
      const std = item.student
      return {
        ...std,
        isPresent: item.isPresent,
        attendanceId: item.id,
      }
    })

    let _students_;
    (sectionId) ? _students_ = _students.filter(s=> s.sectionId == sectionId) : _students_ = _students
      setStudents(_students_)
      return _students_;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  const onSubmit = async (data) => {
   
    let classId;
    let sectionId;
    setADate(data.date)
    if((data.classAndSection).includes("|")) {
    classId = data.classAndSection.split('|')[0]
    sectionId = data.classAndSection.split('|')[1]
    } else{
        classId = data.classAndSection
        sectionId = null 
    }


   
    const _students = await getClassAttendanceByDate(classId, data.date, sectionId)
  
    if(_students.length == 0) {
      getStudentsByClassAndSection(classId)
    .then(res=> res.json())
    .then(stdData=> {
      let std;
       if(sectionId) {
         std = stdData.filter((s) => s.sectionId == parseInt(sectionId))
       } else {
        std = stdData
       }

       let absentStudentsData = std.map(item => {
        if(!item.sectionId) {
          return {
            classId: item.classId,
            studentId: item.id,
            isPresent: false,
            date: new Date(data.date)
          }
        }
        return {
          classId: item.classId,
          sectionId: item.sectionId,
          studentId: item.id,
          isPresent: false,
          date: new Date(data.date)
        }
      })

      std = std.map(item=> {
        return {...item, isPresent: false}
      })

      setAttendanceByDate(absentStudentsData, classId, data.date, sectionId)
    })

    }
    

  };


  // get Data from course and batch no
  useEffect(() => {
    getClasses()
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Course and Section
  useEffect(() => {
    getClasses()
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        let d = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].sections.length != 0) {
            for (let j = 0; j < data[i].sections.length; j++) {
              d.push({
                name: data[i].name + "-" + data[i].sections[j].name,
                value:
                  data[i].sections[j].classId + "|" + data[i].sections[j].id,
              });
            }
          } else {
            d.push({
              name: data[i].name,
              value: data[i].id.toString(),
            });
          }
        }
        setCandS(d);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setValue, isData2]);

  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <h1 className="text-2xl font-bold mb-3">Add Attendance</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border p-5 rounded"
          >
            {classes.length == 0 && (
              <Alert
                title="You have not added any course yet!"
                subtitle="To create section, create course first!"
                link="/dashboard/add-classes"
                linktitle="Add"
              />
            )}
           
            <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-4">
              <label htmlFor="Name" className="md:col-span-1">
                Batch
                <Select
                  onValueChange={(value) => setValue("classAndSection", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course - Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Course - Batch</SelectLabel>
                      {cands.map((cs,i) => (
                        <SelectItem key={i} value={cs.value}>
                          {cs.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>
            
              <label htmlFor="Name" className="md:col-span-1">
                Select Date
                <Input
                  {...register("date", { required: true })}
                  type="date"
                  name="date"
                  required
                  disabled={
                    classes.length == 0
                  }
                />
              </label>
            </div>
            <Button
              size="sm"
              className="h-8 gap-1 mt-5"
              disabled={
                classes.length == 0
              }
            >
              Search
            </Button>
          </form>
          <SelectSeparator className="mt-10"/>

          {
            students.length > 0  && <ClassAttendanceTable students={students} date={aDate} updateAttendanceTable={getClassAttendanceByDate}/>
          }
        </div>
      )}
    </>
  );
};

export default AddAttendance;
