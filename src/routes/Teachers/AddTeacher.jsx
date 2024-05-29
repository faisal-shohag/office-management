import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClasses, getLastTeacher, teacherAdd } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/app_components/Loading";
import Alert from "@/components/app_components/Alert";
import axios from "axios";
import UploadDialog from "@/components/app_components/UploadDialog";
import toast from "react-hot-toast";

const AddTeacher = () => {
  const {
    register,
    handleSubmit,
    setValue,
    // reset
  } = useForm();

  const [classes, setClasses] = useState([]);
  const [isData, setIsData] = useState(false);
  const [isData2, setIsData2] = useState(false);
  // const [teacherCount, setTeacherCount] = useState(0)
  

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }; 
  const uploadFile = async (filename) => {
    setIsDialogOpen(true)
    const formData = new FormData();
    const ext = image.name.split(".").pop()
    const renamedFile = new File([image],`${filename}.${ext}`, {type: image.type})
    formData.append('image', renamedFile);
    try {
      const response = await axios.post('http://localhost:5000/teacher_upload', formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
      console.log('File uploaded:', response.data);
      setIsDialogOpen(false);
    } catch (error) {
      setIsDialogOpen(false);
      console.error('Error uploading file:', error);
    }
  };

  const [image, setImage] = useState(null)

  //  image upload
  const previewFile = () => {
    const preview = document.querySelector('#logo')
    const file = document.querySelector('input[type=file]').files[0]
    setImage(file)
    const reader = new FileReader()
    console.log(file)
  
    reader.addEventListener('load', ()=> {
      preview.src = reader.result;
    }, false)
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }




  const onSubmit = (data) => {
    
    let _data = { ...data, password: "123",};
    let selectedClasses = classes.filter((cls) => cls.selected == true);

    if(selectedClasses.length == 0) {
      toast.error("Please select class to assign!")
      return
    }

    if(!image) {
      toast.error("Please select teacher image.")
      return
    }

    

   
    selectedClasses = selectedClasses.map((cls) => {
      if (cls.selected)
        return {
          class: {
            connect: {
              id: cls.id,
            },
          },
        };
    });

    _data = {
      ...data,
      classes: { create: selectedClasses },
      fixed_salary: parseInt(data.fixed_salary),
      id_no: data.id_no
    };
  
      toast.promise(
        teacherAdd(_data)
      .then((res) => res.json())
      .then((d) => {
        console.log(d)
        if (d.err) throw new Error(d.err);
        updateId()
        uploadFile(d.created.id_no.toString())

      }),
        {
          loading: "Adding teacher...",
          success: <b>Successfully added!</b>,
          error: (error) => <b>{error.message}</b>,
        }
      );
  };


  const updateId = () => {
    getLastTeacher()
    .then((res) => res.json())
    .then((data) => {
      //  console.log(data)
      setIsData2(true);
      const year = new Date().getFullYear().toString();
      let id 
      if(data.length != 0) {
        let sid = data[0].id_no
        id = parseInt(sid.match(/\d{4}$/))
        id += 1
        sid = sid.slice(0, -4)
        id = id.toString().padStart(4, "0")
        id = sid + id
      } else {
        id = year[2] + year[3] + 'T' + "0001";
      }
      setValue("id_no", id.toString());
    })
    .catch((err) => {
      console.log(err);
    });
  }

  

  useEffect(() => {
    getClasses()
      .then((res) => res.json())
      .then((data) => {
        let _data = [];
        for (let d in data) {
          _data.push({ ...data[d], selected: false });
        }
        setClasses(_data);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
      });

      getLastTeacher()
      .then((res) => res.json())
      .then((data) => {
        //  console.log(data)
        setIsData2(true);
        const year = new Date().getFullYear().toString();
        let id 
        if(data.length != 0) {
          let sid = data[0].id_no
          id = parseInt(sid.match(/\d{4}$/))
          id += 1
          sid = sid.slice(0, -4)
          id = id.toString().padStart(4, "0")
          id = sid + id
        } else {
          id = year[2] + year[3] + 'T' + "0001";
        }
        setValue("id_no", id.toString());
      })
      .catch((err) => {
        console.log(err);
      });


  }, [setValue]);

  const handleClassSelect = (id) => {
    classes[id]["selected"] = !classes[id]["selected"];
    setClasses([...classes]);
  };

  return (
    <>
      {!isData && isData2 ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
           <UploadDialog progress={uploadProgress.toString()} isOpen={isDialogOpen} onClose={handleCloseDialog}/>
          <h1 className="text-2xl font-bold mb-3">Add Teacher</h1>
          <>
            {classes.length == 0 ? (
              <Alert
                title="You have not added course yet!"
                subtitle="To add teacher, create course first!"
                link="/dashboard/add-classes"
                linktitle="Add"
              />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="border p-5 rounded"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <label htmlFor="Name" className="md:col-span-1">
                    Name
                    <Input
                      {...register("name", { required: true })}
                      type="text"
                      name="name"
                      placeholder="Name"
                      required
                    />
                  </label>
                  <label htmlFor="Mobile Number" className="md:col-span-1">
                    Mobile Number
                    <Input
                      {...register("phone", { required: true })}
                      type="number"
                      name="phone"
                      placeholder="Mobile Number"
                      required
                    />
                  </label>
                  <label htmlFor="Parmanent Address" className="md:col-span-1">
                    Parmanent Address
                    <Input
                      {...register("present_address", { required: true })}
                      type="text"
                      name="present_address"
                      placeholder="Present Address"
                      required
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <label htmlFor="Parmanent Address" className="md:col-span-1">
                    Present Address
                    <Input
                      {...register("parmanent_address", { required: true })}
                      type="text"
                      name="parmanent_address"
                      placeholder="Parmanent Address"
                      required
                    />
                  </label>
                  <label htmlFor="Email" className="md:col-span-1">
                    Email
                    <Input
                      {...register("email", { required: true })}
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                    />
                  </label>
                  <label htmlFor="Joining Date" className="md:col-span-1">
                    Joining Date
                    <Input
                      {...register("joining_date", { required: true })}
                      type="date"
                      name="joining_date"
                      placeholder="Joining Date"
                      required
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <label htmlFor="Salary" className="md:col-span-1">
                    Salary
                    <Input
                      {...register("fixed_salary", { required: true })}
                      type="number"
                      name="fixed_salary"
                      placeholder="Salary"
                      required
                    />
                  </label>
                  <label htmlFor="NID Number" className="md:col-span-1">
                    NID Number
                    <Input
                      {...register("nid", { required: true })}
                      type="number"
                      name="nid"
                      placeholder="NID Number"
                      required
                    />
                  </label>
                  <label htmlFor="ID" className="md:col-span-1">
                        Teacher ID
                        <Input
                          disabled
                          {...register("id_no", { required: true })}
                          type="text"
                          name="id_no"
                          placeholder="ID"
                          required
                        />
                      </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <label htmlFor="Gender" className="md:col-span-1">
                    Select Gender
                    <Select
                      onValueChange={(value) => setValue("gender", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Gender</SelectLabel>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </label>
                  <label htmlFor="Designation" className="md:col-span-1">
                    Designation
                    <Input
                      {...register("designation", { required: true })}
                      type="text"
                      name="designation"
                      placeholder="Designation"
                      required
                    />
                  </label>
                  <label htmlFor="Department" className="md:col-span-1">
                    Department
                    <Input
                      {...register("department", { required: true })}
                      type="text"
                      name="department"
                      placeholder="Department"
                      required
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <label htmlFor="Date of Birth" className="md:col-span-1">
                    Date of Birth
                    <Input
                      {...register("date_of_birth", { required: true })}
                      type="date"
                      name="date_of_birth"
                      placeholder="Date of Birth"
                      required
                    />
                  </label>
                  <label htmlFor="Education" className="md:col-span-1">
                    Education
                    <Input
                      {...register("education", { required: true })}
                      type="text"
                      name="education"
                      placeholder="Education"
                      required
                    />
                  </label>
                  <label htmlFor="Blood Group" className="md:col-span-1">
                    Blood Group
                    <Input
                      {...register("blood_group", { required: true })}
                      type="text"
                      name="blood_group"
                      placeholder="Blood Group"
                      required
                    />
                  </label>
                </div>

              <div className="">
                <div className="mt-2 font-medium">
                  Select classes to assign:
                </div>
                <div className="mt-3 font-medium flex gap-4">
                  {classes.map((cls, index) => (
                    <div
                      key={cls.id}
                      onClick={() => handleClassSelect(index)}
                      className="flex items-center gap-1 border p-3 rounded-xl cursor-pointer hover:bg-gray-100"
                    >
                      <div>{cls.name}</div>{" "}
                      {cls.selected ? (
                        <CheckCircle size={18} />
                      ) : (
                        <PlusCircle size={18} />
                      )}
                    </div>
                  ))}
                </div>


                <div className="mt-5">
                      <div className="">
                        <label htmlFor="drop-zone">
                          <div className="h-[100px] w-[200px]  flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <Input onChange={previewFile} 
                            className="hidden" id="drop-zone" 
                            type="file" 
                            accept="image/*"/>
                            <img id="logo" className="h-[70px]" src="https://i.postimg.cc/rF77ZXQj/image.png"/>
                          </div>
                        </label>
                      </div>
                      <div className="mt-3 text-gray-400 font-medium">Choose Teacher Photo</div>
                      </div>
                    </div>

                <Button type="submit" size="sm" className="h-8 gap-1 mt-5">
                  Add Teacher
                </Button>
              </form>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default AddTeacher;
