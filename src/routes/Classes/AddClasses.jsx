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
import { classAdd } from "@/lib/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

const AddClasses = () => {
  // const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm();

  // const [isClick, setIsClick] = useState(false)

  const onSubmit = (data) => {
    data = {...data, fee: parseFloat(data.fee)}
    toast.promise(
      classAdd(data)
        .then((res) => {
          reset();
          return res.json();
        })
        .then((d) => {
          if (d.err) throw new Error(d.err);
        }),
      {
        loading: "Creating class...",
        success: <b>Successfully created!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

  // For Class Data
  // const className = [
  //   { id: "1", name: "Web Development" },
  //   { id: "2", name: "Graphics Design" },
  //   { id: "3", name: "Basic Freelancing" },
  //   { id: "4", name: "Back End Engineering" },
  //   { id: "5", name: "Database Management System" },
  // ];

  return (
    <div style={{ overflow: "hidden" }}>
      <h1 className="text-2xl font-bold mb-3">Add Course</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="border p-5 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-4">
        <label htmlFor="Class">
                Course Name
                <Select
                  onValueChange={(value) =>{ 
                    setValue("name", value)
                  }}
                  id="Class"
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Course</SelectLabel>
                      
                        <SelectItem value="Basic Computer">Basic Computer</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Graphics Design">Graphics Design</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                        <SelectItem value="SEO">SEO</SelectItem>
                      
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </label>
          <label htmlFor="Tuition/Course Fee" className="md:col-span-1">
            Tuition/Course Fee
            <Input
              {...register("fee", { required: true })}
              type="number"
              name="fee"
              placeholder="Tuition Fee"
            />
          </label>
        </div>

        <Button type="submit" className="mt-3">
          Add Course
        </Button>
      </form>
    </div>
  );
};

export default AddClasses;
