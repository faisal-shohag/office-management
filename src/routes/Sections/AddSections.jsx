import Alert from "@/components/app_components/Alert";
import Loading from "@/components/app_components/Loading";
import Spinner from "@/components/app_components/Spinner";
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
import { getClassById, getClasses, sectionAdd } from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddSections = () => {
  const { register, handleSubmit, setValue, watch } = useForm();

  const [classes, setClasses] = useState([]);
  const [isData, setIsData] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = (data) => {
    toast.promise(
      sectionAdd(data).then((res) => {
        //reset();
        if (!res.ok) {
          throw new Error("Failed to create class");
        }
        getClass(watch('classId'))
        return res.json();
      }),
      {
        loading: "Creating section...", 
        success: <b>Successfully created!</b>,
        error: <b>Failed to create</b>,
      }
    );
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
  }, []);


  const getClass = (id) => {
    setValue("name", "Loading...")
    setIsLoading(true)
    getClassById(id)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.sections);
        setValue('name', data.sections.length + 1)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <h1 className="text-2xl font-bold mb-3">Add Batch</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border p-5 rounded"
          >
            {classes.length == 0 && (
              <Alert
                title="You have not added any course yet!"
                subtitle="To create batch, create course first!"
                link="/dashboard/add-classes"
                linktitle="Add"
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <label htmlFor="Class">
                Course Name
                <Select
                  onValueChange={(value) =>{ 
                    setValue("classId", value)
                    getClass(value)

                  }}
                  id="Class"
                  disabled={classes.length === 0 ? true : false}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Course</SelectLabel>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>
              <label htmlFor="name" className="md:col-span-1">
                Batch No
                <Input
                  {...register("name", { required: true })}
                  type="text"
                  id="name"
                  placeholder="Batch No"
                  disabled={true}
                  required
                />
              </label>
            </div>
            {isLoading ? <Button
              size="sm"
              className="h-8 mt-5 flex items-center gap-2"
              disabled={true}
            >
             <Spinner styles="h-4 w-4"/> Add Batch
            </Button> : <Button
            size="sm"
            className="h-8 gap-1 mt-5"
            disabled={classes.length === 0 ? true : false}
          >
            Add Batch
          </Button>}
          </form>
        </div>
      )}
    </>
  );
};

export default AddSections;
