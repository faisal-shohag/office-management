/* eslint-disable react/no-unescaped-entities */
import Alert from "@/components/app_components/Alert";
import Loading from "@/components/app_components/Loading";
import UploadDialog from "@/components/app_components/UploadDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdmissionFeeAdd,
  dateTime,
  formDate,
  getClasses,
  getLastStudent,
  getStudentById,
  studentAdd,
  studentReadmission,
} from "@/lib/api";
import { generateLetter } from "@/lib/functions";
import { AuthContext } from "@/Providers/AuthProvider";
import axios from "axios";
import { CreditCard, Search } from "lucide-react";
import { useContext, useEffect,  useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import generatePDF, { Margin, usePDF } from "react-to-pdf";

const AddStudents = () => {
  const api_key = import.meta.env.VITE_serverKey;
  const { register, handleSubmit, setValue, watch } = useForm();

  // const [studentCount, setStudentCount] = useState(0);
  const [cands, setCandS] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isData, setIsData] = useState(false);
  // const [isData2, setIsData2] = useState(false);
  const [isData3, setIsData3] = useState(false);

  const [fee, setFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [other, setOther] = useState(0);
  const [isGenerate, setIsGenerate] = useState(false);
  const [isReAdmission, setIsReAdmission] = useState(false);
  const { targetRef } = usePDF();

  const [info, setInfo] = useState([]);
  const [stdId, setStdID] = useState("");
  const [imageDataURI, setImageDataURI] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isWithoutPayment, setisWithoutPayment] = useState(false);
  const [incharge, setIncharge] = useState(null)

 const [admin, setAdmin] = useState(null)
 useEffect(() => {
  fetch(api_key + 'admin', {
    method: "GET",
    credentials: "include",
  }).then((res) => {
    return res.json();
  }).then(r=> {
    setAdmin(r)
  })
 }, [])


  const AdmissionDataSend = (data) => {
    // console.log(data)
    data = {...data, incharge}
    toast.promise(
      AdmissionFeeAdd(data)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          // console.log(d);
          if (d.err) throw new Error(d.err);
          if (!isWithoutPayment) {
            setIsGenerate(true);
            setTimeout(() => {
              generatePDF(targetRef, {
                filename: `Admission_pay_${watch("id_no")}`,
                page: {
                  margin: Margin.SMALL,
                },
              });
            }, 1000);
            setTimeout(() => {
              setIsGenerate(false);
            }, 2000);
          }
        }),
      {
        loading: "Generating Pay Receipt...",
        success: <b>Generated!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

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
        `${api_key}upload/student/${filename}`,
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

  const idGenerate = (course_batch) => {
    // console.log(course_batch);
    const { name } = cands.filter((item) => item.value == course_batch)[0];
    let cb = generateLetter(name);
    const batch = name.split("-")[1];
    // console.log(cb);
    getLastStudent()
      .then((res) => res.json())
      .then((data) => {
        // setIsData2(true);
        const year = new Date().getFullYear().toString();
        let id;
        // console.log(data)
        if (data.length > 0) {
          let sid = data[0].id_no;
          // console.log("sid_b", sid)
          id = parseInt(sid.match(/\d{4}$/));
          id += 1;
          sid = sid.slice(0, 2);
          // console.log("sid_a", sid);
          id = id.toString().padStart(4, "0");
          id = sid + cb + batch + id;
        } else {
          id = year[2] + year[3] + cb + batch + "0001";
        }
        // console.log("id: ", id)
        isReAdmission
          ? setValue("id_no", document.getElementById("student_id").value)
          : setValue("id_no", id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (data) => {
    if (parseInt(fee) == 0 && !isWithoutPayment) {
      toast.error("You have forget to fill admission fee!");
      return;
    }

    if(!incharge) {
      toast.error("Please specify receiver name.")
      return 
    }

    let _data;
    let Id;
    if (data.classId.includes("|")) {
      Id = data.classId.split("|");
      _data = {
        ...data,
        password: "123",
        classId: parseInt(Id[0]),
        sectionId: parseInt(Id[1]),
        id_no: data.id_no,
      };
    } else {
      _data = {
        ...data,
        password: "123",
        classId: parseInt(data.classId),
        id_no: data.id_no,
        sectionId: null,
      };
    }
    if (isReAdmission) {
      delete _data.id_no;
      toast.promise(
        studentReadmission(_data, stdId)
          .then((res) => {
            return res.json();
          })
          .then((d) => {
            if (d.err) throw new Error(d.err);
            AdmissionDataSend({
              fee: parseFloat(fee+other),
              discount: parseFloat(discount),
              other: parseFloat(other),
              studentId: d.created.id,
              readmission: true,
            });
            setTimeout(() => {
              idGenerate(watch("classId"));
            }, 3000)
            if (image) {
              uploadFile(d.updated.id_no.toString());
            }
          }),
        {
          loading: "Adding student...",
          success: <b>Successfully added!</b>,
          error: (error) => <b>{error.message}</b>,
        }
      );

      return;
    }

    // if (!image) {
    //   toast.error("Please select student image");
    //   return;
    // }

    toast.promise(
      studentAdd(_data)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          if (d.err) throw new Error(d.err);
          AdmissionDataSend({
            fee: parseFloat(fee+other),
            discount: parseFloat(discount),
            other: parseFloat(other),
            studentId: d.created.id,
            readmission: false,
          });

          setTimeout(() => {
            idGenerate(watch("classId"));
          }, 3000)



          if (image) {
            uploadFile(d.created.id_no.toString());
          }
        }),
      {
        loading: "Adding student...",
        success: <b>Successfully added!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

  // const [fixedFee, setFixedFee] = useState(0)

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


    if (admin) {
      setInfo(admin);
      setIsData3(true);
    }
  }, [setValue, admin]);

  const [class_, setCls] = useState("");
  const [sec, setSec] = useState("");
  const [courseFee, setCourseFee] = useState(0)

  const getClass = (id) => {
    if (id.includes("|")) {
      id = id.split("|");
      let cls = classes.filter((c) => c.id == parseInt(id[0]));
      setCourseFee(cls[0].fee)

       
      //  setFixedFee(cls[0].fee)
      //  document.getElementById('fixed_fee').value = cls[0].fee
      setCls(cls[0].name);
      let sec = cls[0].sections.filter((s) => s.id == parseInt(id[1]));
      //  console.log("sec", sec)
      setSec(sec[0].name);
    } else {
      let _class = classes.filter((c) => c.id == parseInt(id));
      //  console.log(_class[0].name)
      setCls(_class[0].name);
      setSec(null);
    }
  };
  
  const [imageData, setImageData] = useState(null)

  const findStudent = () => {
    const id = document.getElementById("student_id").value;
    toast.promise(
      getStudentById(id)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          if (!d) throw new Error("Student not found!");
          if (d.err) throw new Error(d.err);
          setStdID(d.id);
          setImageData(d.image)
          setValue("name", d.name);
          setValue("phone", d.phone);
          setValue("alt_phone", d.alt_phone)
          setValue("present_address", d.present_address);
          setValue("permanent_address", d.permanent_address);
          d.email && setValue("email", d.email);
          // setValue("date_of_birth", formDate(d.date_of_birth));
          setValue("id_no", id);
          setValue("gender", d.gender);
          // setValue("blood_group", d.blood_group.toUpperCase());
          setValue("birth_certificate_no", d.birth_certificate_no);
          setValue("parent_name", d.parent_name);
          setValue("parent_phone", d.parent_phone);
          setValue("local_guardian", d.local_guardian);
          setValue("local_guardian_phone", d.local_guardian_phone);
        }),
      {
        loading: "Searching....",
        success: <b>Found!</b>,
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

  // const [femaleDiscount, setFemaleDiscount] = useState(false)

  const handleGenderDiscount = (gender) => {
     console.log(gender)
    //  if(gender === "female") {
    //   setFemaleDiscount(true)
    //  }
  }


  return (
    <>
      {isData3 ? (
        <div>
          {info.length == 0 ? (
            <Alert
              title="You have not added your Institute Information!"
              subtitle="Please add institution informaton first!"
              link="/admin-settings"
              linktitle="Add"
            />
          ) : (
            <>
              {isData ? (
                <div style={{ overflow: "hidden" }}>
                  <UploadDialog
                    progress={uploadProgress.toString()}
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                  />
                  <h1 className="text-2xl font-bold mb-3">
                    Admission {new Date().getFullYear()}
                  </h1>
                  {cands.length == 0 ? (
                    <Alert
                      title="You have not added course yet!"
                      subtitle="To add students, create course first!"
                      link="/add-classes"
                      linktitle="Add"
                    />
                  ) : (
                    <div className="grid lg:grid-cols-3 gap-5">
                      <div className="col-span-2">
                        <Tabs defaultValue="admission">
                          <TabsList>
                            <TabsTrigger
                              onClick={() => {
                                setIsReAdmission(false);
                              }}
                              value="admission"
                            >
                              Admission
                            </TabsTrigger>
                            <TabsTrigger
                              onClick={() => setIsReAdmission(true)}
                              value="readmission"
                            >
                              Re-Admission
                            </TabsTrigger>
                          </TabsList>
                          {isReAdmission && (
                            <div className="inline-block ml-10">
                              <div className="flex items-center gap-2 text-gray-200">
                                <Input
                                  id="student_id"
                                  className="text-black"
                                  type="text"
                                  placeholder="Student Id"
                                />
                                <Button
                                  onClick={findStudent}
                                  className="flex gap-2"
                                >
                                  <Search size={16} /> Search

                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 mb-3 mt-3">
                            <Checkbox
                              onCheckedChange={(checked) => {
                                setisWithoutPayment(checked);
                              }}
                              id="pay"
                            />
                            <label
                              htmlFor="pay"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Admission without payment.
                            </label>
                          </div>

                          <TabsContent value="admission">
                            <div className="border p-5 rounded-lg  mt-5">
                              <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="grid grid-cols-2 gap-3"
                              >
                                <label htmlFor="Name" className="md:col-span-1">
                                  Name<span className="text-red-500">*</span>
                                  <Input
                                    {...register("name", { required: true })}
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Name"
                                  />
                                </label>
                                <label
                                  htmlFor="Mobile Number"
                                  className="md:col-span-1"
                                >
                                  Mobile Number<span className="text-red-500">*</span>
                                  <Input
                                    {...register("phone", { required: true })}
                                    type="number"
                                    name="phone"
                                    required
                                    placeholder="Mobile Number"
                                  />
                                </label>
                                <label
                                  htmlFor="Alternative Number"
                                  className="md:col-span-1"
                                >
                                  Alternative Mobile Number<span className="text-red-500">*</span>
                                  <Input
                                    {...register("alt_phone", { required: true })}
                                    type="number"
                                    name="alt_phone"
                                    required
                                    placeholder="Alternative Mobile Number"
                                  />
                                </label>
                                <label
                                  htmlFor="Present Address"
                                  className="md:col-span-1"
                                >
                                  Present Address<span className="text-red-500">*</span>
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
                                      required: false,
                                    })}
                                    type="text"
                                    
                                    name="permanent_address"
                                    placeholder="Permanent Address"
                                  />
                                </label>
                                <label
                                  htmlFor="Email"
                                  className="md:col-span-1"
                                >
                                  Email
                                  <Input
                                    {...register("email", { required: false })}
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                  />
                                </label>
                                <label
                                  htmlFor="Date of Birth"
                                  className="md:col-span-1"
                                >
                                  Date of Birth
                                  <Input
                                    {...register("date_of_birth", {
                                      required: false,
                                    })}
                                    type="date"
                                    
                                    name="date_of_birth"
                                  />
                                </label>
                                <label
                                  htmlFor="Class"
                                  className="md:col-span-1"
                                >
                                  Course & Batch<span className="text-red-500">*</span>
                                  <Select
                                    onValueChange={(value) => {
                                      getClass(value);
                                      idGenerate(value);
                                      return setValue("classId", value);
                                    }}
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Course & Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Class - Batch</SelectLabel>
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
                                </label>
                                <label
                                  htmlFor="Group"
                                  className="md:col-span-1 hidden"
                                >
                                  Group
                                  <Select
                                    onValueChange={(value) =>
                                      setValue("group", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Select Class</SelectLabel>
                                        <SelectItem value="na">N/A</SelectItem>
                                        <SelectItem value="science">
                                          Science
                                        </SelectItem>
                                        <SelectItem value="humanity">
                                          Humanity
                                        </SelectItem>
                                        <SelectItem value="business">
                                          Business Studies
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </label>
                                <label
                                  htmlFor="Session"
                                  className="md:col-span-1 hidden"
                                >
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
                                <label
                                  htmlFor="Gender"
                                  className="md:col-span-1"
                                >
                                  Gender<span className="text-red-500">*</span>
                                  <Select
                                    onValueChange={(value) =>{
                                      setValue("gender", value);
                                      handleGenderDiscount(value)
                                    }
                                    }
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Select Gender</SelectLabel>
                                        <SelectItem value="male">
                                          Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                          Female
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </label>
                                <label htmlFor="ID" className="md:col-span-1">
                                  Student ID<span className="text-red-500">*</span>
                                  <Input
                                    disabled
                                    {...register("id_no", { required: true })}
                                    type="text"
                                    name="id_no"
                                    placeholder="ID"
                                    required
                                  />
                                </label>
                                <label
                                  htmlFor="Blood Group"
                                  className="md:col-span-1 hidden"
                                >
                                  Blood Group
                                  <Select
                                    onValueChange={(value) =>
                                      setValue("blood_group", value)
                                    }
                                    // required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>
                                          Select Blood Group
                                        </SelectLabel>
                                        <SelectItem value="a+">A+</SelectItem>
                                        <SelectItem value="a-">A-</SelectItem>
                                        <SelectItem value="b+">B+</SelectItem>
                                        <SelectItem value="b-">B-</SelectItem>
                                        <SelectItem value="ab+">AB+</SelectItem>
                                        <SelectItem value="ab-">AB-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </label>
                                <label
                                  htmlFor="B/C Number"
                                  className="md:col-span-1"
                                >
                                  B/C or NID No.
                                  <Input
                                    {...register("birth_certificate_no", {
                                      required: false,
                                    })}
                                    type="number"
                                    
                                    name="birth_certificate_no"
                                    placeholder="NID or Birth certificate number"
                                  />
                                </label>
                                <label
                                  htmlFor="Parents Name"
                                  className="md:col-span-1"
                                >
                                  Parents Name<span className="text-red-500">*</span>
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
                                <label
                                  htmlFor="Parents Phone"
                                  className="md:col-span-1"
                                >
                                  Parents Phone<span className="text-red-500">*</span>
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
                                  Local Guardian&apos;s Name
                                  <Input
                                    {...register("local_guardian", {
                                      required: false,
                                    })}
                                    type="text"
                                    
                                    name="local_guardian"
                                    placeholder="Local Guardians"
                                  />
                                </label>
                                <label
                                  htmlFor="Local Guardians Phone Number"
                                  className="md:col-span-1"
                                >
                                  Local Guardian&apos;s Phone
                                  <Input
                                    {...register("local_guardian_phone", {
                                      required: false,
                                    })}
                                    type="text"
                                    
                                    name="local_guardian_phone"
                                    placeholder="Local Guardians Phone Number"
                                  />
                                </label>
                                {/* <label
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
                                  className="h-8 gap-1 mt-5 col-span-2"
                                >
                                  Submit
                                </Button>
                              </form>
                            </div>
                          </TabsContent>

                          <TabsContent value="readmission">
                            <div className="border p-5 rounded mt-5">
                              <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="grid grid-cols-2 gap-3"
                              >
                                <label htmlFor="Name" className="md:col-span-1">
                                  Name<span className="text-red-500">*</span>
                                  <Input
                                    {...register("name", { required: true })}
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Name"
                                  />
                                </label>
                                <label
                                  htmlFor="Mobile Number"
                                  className="md:col-span-1"
                                >
                                  Mobile Number<span className="text-red-500">*</span>
                                  <Input
                                    {...register("phone", { required: true })}
                                    type="number"
                                    name="phone"
                                    required
                                    placeholder="Mobile Number"
                                  />
                                </label>
                                <label
                                  htmlFor="Alternative Number"
                                  className="md:col-span-1"
                                >
                                  Alternative Mobile Number<span className="text-red-500">*</span>
                                  <Input
                                    {...register("alt_phone", { required: true })}
                                    type="number"
                                    name="alt_phone"
                                    required
                                    placeholder="Alternative Mobile Number"
                                  />
                                </label>
                                <label
                                  htmlFor="Present Address"
                                  className="md:col-span-1"
                                >
                                  Present Address<span className="text-red-500">*</span>
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
                                      required: false,
                                    })}
                                    type="text"
                                    name="permanent_address"
                                    placeholder="Permanent Address"
                                  />
                                </label>
                                <label
                                  htmlFor="Email"
                                  className="md:col-span-1"
                                >
                                  Email
                                  <Input
                                    {...register("email", { required: false })}
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                  />
                                </label>
                                <label
                                  htmlFor="Date of Birth"
                                  className="md:col-span-1"
                                >
                                  Date of Birth
                                  <Input
                                    {...register("date_of_birth", {
                                      required: false,
                                    })}
                                    type="date"
                                    
                                    name="date_of_birth"
                                  />
                                </label>
                                <label
                                  htmlFor="Class"
                                  className="md:col-span-1"
                                >
                                  Course & Batch<span className="text-red-500">*</span>
                                  <Select
                                    onValueChange={(value) => {
                                      getClass(value);
                                      return setValue("classId", value);
                                    }}
                                    required
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Class & Section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Select Class</SelectLabel>
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
                                </label>
                                <label
                                  htmlFor="Group"
                                  className="md:col-span-1 hidden"
                                >
                                  Group
                                  <Select
                                    onValueChange={(value) =>
                                      setValue("group", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Select Class</SelectLabel>
                                        <SelectItem value="na">N/A</SelectItem>
                                        <SelectItem value="science">
                                          Science
                                        </SelectItem>
                                        <SelectItem value="humanity">
                                          Humanity
                                        </SelectItem>
                                        <SelectItem value="business">
                                          Business Studies
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </label>
                                <label
                                  htmlFor="Session"
                                  className="md:col-span-1 hidden"
                                >
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
                                <label
                                  htmlFor="Gender"
                                  className="md:col-span-1"
                                >
                                  Gender<span className="text-red-500">*</span>
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
                                <label
                                  htmlFor="Blood Group"
                                  className="md:col-span-1 hidden"
                                >
                                  Blood Group
                                  <Input
                                    disabled
                                    {...register("blood_group", {
                                     
                                    })}
                                    type="text"
                                    name="blood_group"
                                    placeholder="Blood Group"
                                  />
                                </label>
                                <label
                                  htmlFor="B/C Number"
                                  className="md:col-span-1"
                                >
                                  B/C Number
                                  <Input
                                    {...register("birth_certificate_no", {
                                      required: false,
                                    })}
                                    type="number"
                                  
                                    name="birth_certificate_no"
                                    placeholder="Birth Certificate Number"
                                  />
                                </label>
                                <label
                                  htmlFor="Parents Name"
                                  className="md:col-span-1"
                                >
                                  Parents Name<span className="text-red-500">*</span>
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
                                <label
                                  htmlFor="Parents Phone"
                                  className="md:col-span-1"
                                >
                                  Parents Phone<span className="text-red-500">*</span>
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
                                      required: false,
                                    })}
                                    type="text"
                                  
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
                                      required: false,
                                    })}
                                    type="text"
                                    
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
                                        {imageData ? 
                                        <img
                                        id="logo"
                                        className="h-[70px]"
                                        src={imageData.data.image.url}
                                      /> : <img
                                      id="logo"
                                      className="h-[70px]"
                                      src="https://i.postimg.cc/rF77ZXQj/image.png"
                                    />}
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
                                  Submit & Generate Payslip
                                </Button>
                              </form>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      {!isWithoutPayment && (
                        <div>
                          <Card
                            className="overflow-hidden"
                            x-chunk="dashboard-05-chunk-4"
                          >
                            <CardHeader className="text-center bg-muted/50">
                              <div className="grid gap-0.5">
                                <CardTitle className="flex flex-col items-center justify-center gap-2 text-lg">
                                  <div className="">
                                    <img
                                      alt="logo"
                                      className="h-[80px]"
                                      src='./inst_logo.webp'
                                    />
                                  </div>

                                  <div className="lg:w-[77%]">
                                    {/*  <div>{admin?.inst_name}</div> */}
                                    <div className="text-sm">
                                      EIIN: {admin?.inst_eiin}
                                    </div>
                                    <CardDescription>
                                      Date: {dateTime(new Date())}
                                    </CardDescription>
                                  </div>
                                </CardTitle>

                                <div className="text-xl mt-2 font-bold">
                                  Admission Payment Receipt
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 text-sm">
                              <div className="grid gap-3">
                                <div className="font-semibold">
                                  Student Information's
                                </div>
                                <ul className="grid gap-3">
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Student Name
                                    </span>
                                    <span>{watch("name")}</span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Course Name
                                    </span>
                                    <span> {class_} </span>
                                  </li>
                                  {sec && (
                                    <li className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Course Batch
                                      </span>
                                      <span> {sec} </span>
                                    </li>
                                  )}
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Student Id No
                                    </span>
                                    <span> {watch("id_no")} </span>
                                  </li>

                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Student Phone
                                    </span>
                                    <span> {watch("phone")} </span>
                                  </li>
                                </ul>
                               
                                <Separator className="my-2" />
                                <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Course Fee
                                    </span>
                                    <span>
                                      {courseFee}
                                    </span>
                                  </li>
                                  
                                  <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Discount(Flat)
                                  </span>
                                  <span>
                                    <input
                                      onChange={(e) =>
                                        setDiscount(
                                          !e.target.value == ""
                                            ? parseFloat(e.target.value)
                                            : 0
                                        )
                                      }
                                      defaultValue={0}
                                      className="border dark:bg-black text-right  rounded-xl w-[100px]"
                                      type="number"
                                      placeholder="00"
                                    />
                                  </span>
                                </li>
                                <Separator className="mt-2" />
                                <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">
                                      Sub Total
                                    </span>
                                    <span>
                                      {(courseFee) - discount}
                                      ৳
                                    </span>
                                  </li>
                                  <Separator className="" />
                                  <li className=" hidden items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Other
                                    </span>
                                    <span>
                                      <input
                                        onChange={(e) =>
                                          setOther(
                                            !e.target.value == ""
                                              ? parseFloat(e.target.value)
                                              : 0
                                          )
                                        }
                                        defaultValue={0}
                                        className="border dark:bg-black  rounded-xl w-[100px] text-right"
                                        type="number"
                                        placeholder="00"
                                      />
                                    </span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Admission Fee
                                    </span>
                                    <span>
                                      <input
                                        onChange={(e) =>
                                          setFee(
                                            !e.target.value == ""
                                              ? parseFloat(e.target.value)
                                              : 0
                                          )
                                        }
                                        className="border dark:bg-black rounded-xl w-[100px] text-right"
                                        type="number"
                                        placeholder="00"
                                      />
                                    </span>
                                  </li>
                                  <Separator className="" />
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">
                                      Total
                                    </span>
                                    <span>
                                      {fee +
                                        other}
                                      ৳
                                    </span>
                                  </li>
                                  <Separator className="" />
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-red-500">
                                      Due
                                    </span>
                                    <span className="text-red-500">
                                      {(courseFee-fee) +
                                        other - discount}
                                      ৳
                                    </span>
                                  </li>
                                  
                                </ul>
                              </div>

                              <Separator className="my-4" />
                           
                            </CardContent>
                            <hr></hr>
                            {/* Admission Condition */}
                            <div
                              className="p-5"
                              style={{ fontFamily: "Hind Siliguri" }}
                            >
                              <h1 className="text-center text-2xl mb-3">
                                ভর্তির শর্তাবলী
                              </h1>
                              <ul>
                                <li className="mb-3">
                                  ১। কোর্স ফি দুই বা তিন কিস্তিতে পরিশোধ করা
                                  যাবে ।
                                </li>
                                <li className="mb-3">
                                  ২। কোর্স ফি কোন ভাবেই ফেরত যোগ্য নয়।
                                </li>
                                <li className="mb-3">
                                  ৩। অনিয়মিত প্রশিক্ষণার্থীদের সার্টিফিকেট
                                  প্রদান করা হবে না।
                                </li>
                                <li className="mb-3">
                                  ৪। আপনার যে কোন অসঙ্গতিপূর্ণ ব্যবহারের জন্য
                                  কর্তৃপক্ষ আপনার ভর্তি বাতিল করতে পারে।
                                </li>
                                <li>
                                  ৫। ক্লাসের সময় ও দিন পরিবর্তন ও পরিবর্ধন বিষয়ক সকল ক্ষমতা কর্তৃপক্ষের হাতে নিহিত থাকবে।
                                </li>
                              </ul>
                            </div>
                            <hr></hr>
                            {/* Signature */}
                            <div className="flex flex-row justify-between p-5 text-center">
                              <div>
                                <Input type="text" onChange={(e)=> {
                                  // console.log(e.target.value)
                                  setIncharge(e.target.value)
                                }}  placeholder="Name"/>
                                <hr></hr>
                                <b>Received By</b>
                              </div>
                              <div>
                                <p className="font-hind">সৈয়দ মুহীউদ্দীন ফাহাদ</p>
                                <hr></hr>
                                <b>Founder</b>
                              </div>
                            </div>
                            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 justify-between bg-[#2b74ba] text-white">
                              <div className="text-xs">
                                <h1>{admin.inst_address} || </h1>
                              </div>
                              <div className="text-xs">
                                <h1>|| {admin.inst_email} || </h1>
                              </div>
                              <div className="text-xs ">
                                <h1>|| {admin.inst_phone}</h1>
                              </div>
                            </CardFooter>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Downloadable payslip */}
                  <div className={isGenerate ? "block mt-60" : "hidden"}>
                    <div className="lg:grid grid-cols-2  gap-5">
                      <div style={{ transform: "scale(2)" }} ref={targetRef}>
                      <Card
                            className="overflow-hidden"
                            x-chunk="dashboard-05-chunk-4"
                          >
                            <CardHeader className="text-center bg-muted/50">
                              <div className="grid gap-0.5">
                                <CardTitle className="flex flex-col items-center justify-center gap-2 text-lg">
                                  <div className="">
                                    <img
                                      alt="logo"
                                      className="h-[80px]"
                                      src='./inst_logo.webp'
                                    />
                                  </div>

                                  <div className="lg:w-[77%]">
                                    {/*  <div>{admin?.inst_name}</div> */}
                                    <div className="text-sm">
                                      EIIN: {admin?.inst_eiin}
                                    </div>
                                    <CardDescription>
                                      Date: {dateTime(new Date())}
                                    </CardDescription>
                                  </div>
                                </CardTitle>

                                <div className="text-xl mt-2 font-bold">
                                  Admission Payment Receipt
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 text-sm">
                              <div className="grid gap-3">
                                <div className="font-semibold">
                                  Student Information's
                                </div>
                                <ul className="grid gap-3">
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Student Name
                                    </span>
                                    <span>{watch("name")}</span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Course Name
                                    </span>
                                    <span> {class_} </span>
                                  </li>
                                  {sec && (
                                    <li className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Course Batch
                                      </span>
                                      <span> {sec} </span>
                                    </li>
                                  )}
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Student Id No
                                    </span>
                                    <span> {watch("id_no")} </span>
                                  </li>

                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Student Phone
                                    </span>
                                    <span> {watch("phone")} </span>
                                  </li>
                                </ul>
                               
                                <Separator className="my-2" />
                                <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Course Fee
                                    </span>
                                    <span>
                                     {courseFee}
                                    </span>
                                  </li>
                                  
                                  <li className=" items-center justify-between hidden">
                                  <span className="text-muted-foreground">
                                    Discount(Flat)
                                  </span>
                                  <span>
                                   {discount}
                                  </span>
                                </li>
                                <Separator className="mt-2" />
                                <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">
                                      Sub Total
                                    </span>
                                    <span>
                                      {(courseFee) +
                                        other - discount}
                                      ৳
                                    </span>
                                  </li>
                                  <Separator className="" />
                                  <li className="hidden items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Other
                                    </span>
                                    <span>
                                     {other}
                                    </span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Admission Fee
                                    </span>
                                    <span>
                                      {fee}
                                    </span>
                                  </li>
                                  <Separator className="" />
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-muted-foreground">
                                      Total
                                    </span>
                                    <span>
                                      {fee +
                                        other}
                                      ৳
                                    </span>
                                  </li>
                                  <Separator className="" />
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-red-500">
                                      Due
                                    </span>
                                    <span className="text-red-500">
                                      {(courseFee-fee) +
                                        other - discount}
                                      ৳
                                    </span>
                                  </li>
                                  
                                </ul>
                              </div>

                              <Separator className="my-3" />
                           
                            </CardContent>
                            <hr></hr>
                            {/* Admission Condition */}
                            <div
                              className="p-5"
                              style={{ fontFamily: "Hind Siliguri" }}
                            >
                              <h1 className="text-center text-2xl mb-3">
                                ভর্তির শর্তাবলী
                              </h1>
                              <ul>
                                <li className="mb-3">
                                  ১। কোর্স ফি দুই বা তিন কিস্তিতে পরিশোধ করা
                                  যাবে ।
                                </li>
                                <li className="mb-3">
                                  ২। কোর্স ফি কোন ভাবেই ফেরত যোগ্য নয়।
                                </li>
                                <li className="mb-3">
                                  ৩। অনিয়মিত প্রশিক্ষণার্থীদের সার্টিফিকেট
                                  প্রদান করা হবে না।
                                </li>
                                <li className="mb-3">
                                  ৪। আপনার যে কোন অসঙ্গতিপূর্ণ ব্যবহারের জন্য
                                  কর্তৃপক্ষ আপনার ভর্তি বাতিল করতে পারে।
                                </li>
                                <li>
                                  ৫। ক্লাসের সময় ও দিন পরিবর্তন ও পরিবর্ধন বিষয়ক সকল ক্ষমতা কর্তৃপক্ষের হাতে নিহিত থাকবে।
                                </li>
                              </ul>
                            </div>
                            <hr></hr>
                            {/* Signature */}
                            <div className="flex flex-row justify-between p-5 text-center">
                              <div>
                                <span className="font-hind">{incharge}</span>
                                <br/>
                                <b>Received By</b>
                              </div>
                              <div>
                                <span className="font-hind">সৈয়দ মুহীউদ্দীন ফাহাদ</span>
                                <br/>
                                <b>Founder</b>
                              </div>
                            </div>
                            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 justify-between bg-[#2b74ba] text-white">
                              <div className="text-xs">
                                <h1>{admin.inst_address} || </h1>
                              </div>
                              <div className="text-xs">
                                <h1>|| {admin.inst_email} || </h1>
                              </div>
                              <div className="text-xs ">
                                <h1>|| {admin.inst_phone}</h1>
                              </div>
                            </CardFooter>
                          </Card>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Loading />
              )}
            </>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default AddStudents;