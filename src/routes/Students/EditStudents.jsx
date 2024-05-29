/* eslint-disable react/no-unescaped-entities */
import Alert from "@/components/app_components/Alert";
import Loading from "@/components/app_components/Loading";
import UploadDialog from "@/components/app_components/UploadDialog";
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
import {
  formDate,
  getImage,
  getStudentById,
  studentAdd,
  studentUpdate,
} from "@/lib/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditStudents = () => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [isData, setIsData] = useState(false);

  const [stdId, setStdID] = useState("");
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
        "http://localhost:5000/student_upload",
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
      navigate("/dashboard/students");
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
      studentUpdate(data, tableId)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          if (d.err) throw new Error(d.err);
          console.log(d);

          if (image) {
            uploadFile(d.updated.id_no.toString());
          }
        }),
      {
        loading: "Updating student...",
        success: <b>Successfully updated!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

  const id = useParams();
  useEffect(() => {
    getStudentById(id.id)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        //console.log(d);
        setTableId(d.id);
        if (!d) throw new Error("Student not found!");
        if (d.err) throw new Error(d.err);
        setStdID(d.id);
        setValue("name", d.name);
        setValue("phone", d.phone);
        setValue("present_address", d.present_address);
        setValue("permanent_address", d.permanent_address);
        setValue("email", d.email);
        setValue("date_of_birth", formDate(d.date_of_birth));
        setValue("id_no", id.id);
        setValue("gender", d.gender);
        setValue("blood_group", d.blood_group.toUpperCase());
        setValue("birth_certificate_no", d.birth_certificate_no);
        setValue("parent_name", d.parent_name);
        setValue("parent_phone", d.parent_phone);
        setValue("local_guardian", d.local_guardian);
        setValue("local_guardian_phone", d.local_guardian_phone);
        setIsData(true);
      });

    setTimeout(() => {
      getImage("students", id.id)
        .then((res) => {
          if (!res.ok) {
            console.log(res);
            return;
          }
          document.getElementById("logo").src = res.url;
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1500);
  }, [id, setValue]);

  return (
    <>
      <div>
        <>
          {isData ? (
            <div style={{ overflow: "hidden" }}>
              <UploadDialog
                progress={uploadProgress.toString()}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
              />
              <h1 className="text-2xl font-bold mb-3">
                Update Student Data {new Date().getFullYear()}
              </h1>
              <div className="grid lg:grid-cols-1 gap-5">
                <div className="col-span-2">
                  {/* Readmission */}

                  <div className="border p-5 rounded mt-5">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label htmlFor="Name" className="md:col-span-1">
                        Name
                        <Input
                          {...register("name", { required: true })}
                          type="text"
                          name="name"
                          required
                          placeholder="Name"
                        />
                      </label>
                      <label htmlFor="Mobile Number" className="md:col-span-1">
                        Mobile Number
                        <Input
                          {...register("phone", { required: true })}
                          type="number"
                          name="phone"
                          required
                          placeholder="Mobile Number"
                        />
                      </label>
                      <label
                        htmlFor="Present Address"
                        className="md:col-span-1"
                      >
                        Present Address
                        <Input
                          {...register("present_address", {
                            required: true,
                          })}
                          type="text"
                          required
                          name="present_address"
                          placeholder="Present Address"
                        />
                      </label>
                      <label
                        htmlFor="Permanent Address"
                        className="md:col-span-1"
                      >
                        Permanent Address
                        <Input
                          {...register("permanent_address", {
                            required: true,
                          })}
                          type="text"
                          required
                          name="permanent_address"
                          placeholder="Permanent Address"
                        />
                      </label>
                      <label htmlFor="Email" className="md:col-span-1">
                        Email
                        <Input
                          {...register("email", { required: true })}
                          type="email"
                          required
                          name="email"
                          disabled
                          placeholder="Email"
                        />
                      </label>
                      <label htmlFor="Date of Birth" className="md:col-span-1">
                        Date of Birth
                        <Input
                          {...register("date_of_birth", {
                            required: true,
                          })}
                          type="date"
                          required
                          name="date_of_birth"
                        />
                      </label>
                      {/* <label htmlFor="Class" className="md:col-span-1">
                              Course & Batch
                              <Select
                                onValueChange={(value) => {
                                  getClass(value);
                                  return setValue("classId", value);
                                }}
                                required
                                value={watch("classId")}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Course and Batch" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Select Course and Batch</SelectLabel>
                                    {cands.map((cs) => (
                                      <SelectItem
                                        key={cs.name}
                                        value={cs.value}
                                      >
                                        {cs.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </label> */}
                      <label htmlFor="Group" className="md:col-span-1 hidden">
                        Group
                        <Select
                          onValueChange={(value) => setValue("group", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select Class</SelectLabel>
                              <SelectItem value="na">N/A</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="humanity">Humanity</SelectItem>
                              <SelectItem value="business">
                                Business Studies
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </label>
                      <label htmlFor="Session" className="md:col-span-1 hidden">
                        Session
                        <Input
                          {...register("session", {
                            required: false,
                          })}
                          type="text"
                          name="session"
                          placeholder="Session"
                        />
                      </label>
                      <label htmlFor="Gender" className="md:col-span-1">
                        Gender
                        <Input
                          disabled
                          {...register("gender", { required: true })}
                          type="text"
                          name="gender"
                          placeholder="Gender"
                        />
                      </label>
                      <label htmlFor="ID" className="md:col-span-1">
                        Student ID
                        <Input
                          disabled
                          {...register("id_no", { required: true })}
                          type="text"
                          name="id_no"
                          placeholder="ID"
                        />
                      </label>
                      <label htmlFor="Blood Group" className="md:col-span-1">
                        Blood Group
                        <Input
                          disabled
                          {...register("blood_group", {
                            required: true,
                          })}
                          type="text"
                          name="blood_group"
                          placeholder="Blood Group"
                        />
                      </label>
                      <label htmlFor="B/C Number" className="md:col-span-1">
                        B/C Number
                        <Input
                          {...register("birth_certificate_no", {
                            required: true,
                          })}
                          type="number"
                          required
                          name="birth_certificate_no"
                          placeholder="Birth Certificate Number"
                        />
                      </label>
                      <label htmlFor="Parents Name" className="md:col-span-1">
                        Parents Name
                        <Input
                          {...register("parent_name", {
                            required: true,
                          })}
                          type="text"
                          required
                          name="parent_name"
                          placeholder="Parents Name"
                        />
                      </label>
                      <label htmlFor="Parents Phone" className="md:col-span-1">
                        Parents Phone
                        <Input
                          {...register("parent_phone", {
                            required: true,
                          })}
                          type="text"
                          required
                          name="parent_phone"
                          placeholder="Parents Phone"
                        />
                      </label>
                      <label
                        htmlFor="Local Guardians"
                        className="md:col-span-1"
                      >
                        L-Guardian Name
                        <Input
                          {...register("local_guardian", {
                            required: true,
                          })}
                          type="text"
                          required
                          name="local_guardian"
                          placeholder="Local Guardians"
                        />
                      </label>
                      <label
                        htmlFor="Local Guardians Phone Number"
                        className="md:col-span-1"
                      >
                        L Guardian&apos;s Phone
                        <Input
                          {...register("local_guardian_phone", {
                            required: true,
                          })}
                          type="text"
                          required
                          name="local_guardian_phone"
                          placeholder="Local Guardians Phone Number"
                        />
                      </label>
                      {/*   <label
                                  htmlFor="Local Guardians Phone Number"
                                  className="md:col-span-1"
                                >
                                  Payment Received By
                                  <Input
                                    {...register("payment_received", {
                                      required: true,
                                    })}
                                    type="text"
                                    required
                                    name="payment_received"
                                    placeholder="Name Of Receiver"
                                  />
                                </label> */}
                      <div>
                        <div className="">
                          <label htmlFor="drop-zone">
                            <div className="h-[100px]  flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <input
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
                        <div className="mt-3 text-gray-400 font-medium text-center">
                          Choose Student Photo
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="h-8 gap-1 mt-5 col-span-2 w-full"
                      >
                        Update Data
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </>
      </div>
    </>
  );
};
export default EditStudents;
