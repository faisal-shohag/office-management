import Loading from "@/components/app_components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classUpdate, getClassById } from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const EditClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isData, setIsData] = useState(false);
  const { register, handleSubmit, setValue} = useForm();
   // get data from URL
   const classId = useParams();

  const onSubmit = (data) => {
    toast.promise(
      classUpdate(data, classId.id)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          if (d.err) throw new Error(d.err);
        }),
      {
        loading: "Updating class...",
        success: <b>Successfully updated!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  }


 
  useEffect(() => {
    getClassById(classId.id)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setClasses(data);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [classId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClasses((prevClasses) => ({
      ...prevClasses,
      [name]: value,
    }));
  };
  //console.log(classes);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Update Data</h1>
      {!isData ? (
        <Loading />
      ) : (
        <form className="border p-5 rounded" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-4">
            <label htmlFor="Tuition/Course Fee" className="md:col-span-1">
              Batch Name
              <Input
                {...register("name", { required: true })}
                type="text"
                name="name"
                placeholder="Class/Batch Name"
                value={classes.name || ""}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="Tuition/Course Fee" className="md:col-span-1">
              Course Fee
              <Input
                {...register("fee", { required: true })}
                type="number"
                name="fee"
                placeholder="Tuition Fee"
                value={classes.fee || ""}
                onChange={handleChange}
              />
            </label>
          </div>

          <Button type="submit" className="mt-3">
            Update Data
          </Button>
        </form>
      )}
    </div>
  );
};

export default EditClasses;
