import Alert from "@/components/app_components/Alert";
import Loading from "@/components/app_components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClasses, getTeachers } from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddSubjects = () => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isData, setIsData] = useState(false);
  const [isData2, setIsData2] = useState(false);

  const onSubmit = (data) => {
    reset();
    fetch("http://localhost:5000/subject_add", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        classId: parseInt(data.classId),
        mark: parseInt(data.mark),
        teacherId: parseInt(data.teacherId),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.err) {
          toast.error(data.err);
        } else {
          toast.success("Successfuly added!");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        console.log(err);
      });
    console.log(data);
  };

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

    getTeachers()
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
        setIsData2(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {!isData || !isData2 ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <h1 className="text-2xl font-bold mb-3">Add Subjects</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border p-5 rounded"
          >
            {classes.length == 0 && (
              <Alert
                title="You have not added any class yet!"
                subtitle="To create section, create class first!"
                link="/dashboard/add-classes"
                linktitle="Add"
              />
            )}
            {teachers.length == 0 && (
              <Alert
                title="You have not added any Teacher yet!"
                subtitle="To create subject, add teacher first!"
                link="/dashboard/add-teachers"
                linktitle="Add"
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 mt-3 gap-4">
              <label htmlFor="Name" className="md:col-span-1">
                Subject
                <Input
                  {...register("name", { required: true })}
                  type="text"
                  name="name"
                  placeholder="Subject/Course Name"
                  required
                  disabled={
                    classes.length == 0 || teachers.length == 0 ? true : false
                  }
                />
              </label>
              <label htmlFor="Assign Teacher" className="md:col-span-1">
                Marks
                <Input
                  {...register("mark", { required: true })}
                  type="number"
                  name="mark"
                  placeholder="Marks"
                  required
                  disabled={
                    classes.length == 0 || teachers.length == 0 ? true : false
                  }
                />
              </label>

              <label htmlFor="Class">
                Class
                <Select
                  onValueChange={(value) => setValue("classId", value)}
                  id="Class"
                  disabled={
                    classes.length == 0 || teachers.length == 0 ? true : false
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Class</SelectLabel>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>

              <label htmlFor="Teachers">
                Subject Teacher
                <Select
                  onValueChange={(value) => setValue("teacherId", value)}
                  disabled={
                    classes.length == 0 || teachers.length == 0 ? true : false
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select subject teacher</SelectLabel>
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.name} - {t.department}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>
            </div>
            <Button
              size="sm"
              className="h-8 gap-1 mt-5"
              disabled={
                classes.length == 0 || teachers.length == 0 ? true : false
              }
            >
              Add Subject
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddSubjects;
