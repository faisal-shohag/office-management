import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formDate,
  getStaffById,
  staffUpdate,
} from "@/lib/api";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Loading from "@/components/app_components/Loading";
import axios from "axios";
import UploadDialog from "@/components/app_components/UploadDialog";
import {  useParams } from "react-router-dom";
import toast from "react-hot-toast";
const api_key = import.meta.env.VITE_apiKey;

const EditStuff = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [isData, setIsData] = useState(false);

  const [tableId, setTableId] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const uploadFile = async (filename) => {
    setIsDialogOpen(true);
    const formData = new FormData();
    const ext = image.name.split(".").pop();
    const renamedFile = new File([image], `${filename}.${ext}`, {
      type: image.type,
    });
    formData.append("image", renamedFile);
    try {
      const response = await axios.post(
        `${api_key}upload/staff/${filename}`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        }
      );
      console.log("File uploaded:", response.data);
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      setIsDialogOpen(false);
      console.error("Error uploading file:", error);
    }
  };

  const [image, setImage] = useState(null);

  //  image upload
  const previewFile = () => {
    const preview = document.querySelector("#logo");
    const file = document.querySelector("input[type=file]").files[0];
    setImage(file);
    const reader = new FileReader();
    console.log(file);

    reader.addEventListener(
      "load",
      () => {
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
     toast.promise(
      staffUpdate(data, tableId)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          if (d.err) throw new Error(d.err);
          if (image) {
            uploadFile(d.updated.id_no.toString());
          }
        }),
      {
        loading: "Updating staff...",
        success: <b>Successfully updated!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    ); 
  };

  const id = useParams();
  useEffect(() => {
    getStaffById(id.id)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        setTableId(d.id);
        if (!d) throw new Error("Staff not found!");
        if (d.err) throw new Error(d.err);
        setValue("name", d.name);
        setValue("phone", d.phone);
        setValue("present_address", d.present_address);
        setValue("permanent_address", d.permanent_address);
        setValue("email", d.email);
        setValue("joining_date", formDate(d.joining_date));
        setValue("date_of_birth", formDate(d.date_of_birth));
        setValue("fixed_salary", d.fixed_salary);
        setValue("designation", d.designation);
        setValue("department", d.department);
        setValue("nid",d.nid);
        setValue("id_no", id.id);
        setValue("gender", d.gender.toUpperCase());
        setValue("education", d.education);
        setValue("blood_group", d.blood_group.toUpperCase());
        setValue("birth_certificate_no", d.birth_certificate_no);
        setValue("parent_name", d.parent_name);
        setValue("parent_phone", d.parent_phone);
        setValue("local_guardian", d.local_guardian);
        setValue("local_guardian_phone", d.local_guardian_phone);
        setIsData(true);
      });

  }, [id, setValue]);

  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <UploadDialog
            progress={uploadProgress.toString()}
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
          />
          <h1 className="text-2xl font-bold mb-3">Update Staff</h1>
          <>
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
                    {...register("permanent_address", { required: true })}
                    type="text"
                    name="permanent_address"
                    placeholder="Present Address"
                    required
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <label htmlFor="Parmanent Address" className="md:col-span-1">
                  Present Address
                  <Input
                    {...register("present_address", { required: true })}
                    type="text"
                    name="present_address"
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
                  <Input
                    disabled
                    {...register("gender")}
                    type="text"
                    name="gender"
                    placeholder="ID"
                    required
                  />
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
                {/*   {classes.map((cls, index) => (
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
                  ))} */}
                </div>

                <div className="mt-5">
                  <div className="">
                    <label htmlFor="drop-zone">
                      <div className="h-[100px] w-[200px]  flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <Input
                          onChange={previewFile}
                          className="hidden"
                          id="drop-zone"
                          type="file"
                          accept="image/*"
                        />
                        <img
                          id="logo"
                          className="h-[70px]"
                          src="https://i.postimg.cc/rF77ZXQj/image.png"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="mt-3 text-gray-400 font-medium">
                    Choose Teacher Photo
                  </div>
                </div>
              </div>

              <Button type="submit" size="sm" className="h-8 gap-1 mt-5">
                Update Staff
              </Button>
            </form>
          </>
        </div>
      )}
    </>
  );
};

export default EditStuff;
