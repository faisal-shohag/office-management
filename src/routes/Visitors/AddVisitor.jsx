import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClasses, getLastTeacher, teacherAdd } from "@/lib/api";
import { useForm } from "react-hook-form";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/app_components/Loading";
import Alert from "@/components/app_components/Alert";
import axios from "axios";
import UploadDialog from "@/components/app_components/UploadDialog";
import toast from "react-hot-toast";

const AddVisitor = () => {
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
    const api_key = import.meta.env.VITE_apiKey;

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    const uploadFile = async (filename) => {
        setIsDialogOpen(true)
        const formData = new FormData();
        const ext = image.name.split(".").pop()
        const renamedFile = new File([image], `${filename}.${ext}`, { type: image.type })
        formData.append('image', renamedFile);
        try {
            const response = await axios.post(`${api_key}upload/teacher/${filename}`, formData, {
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

        reader.addEventListener('load', () => {
            preview.src = reader.result;
        }, false)

        if (file) {
            reader.readAsDataURL(file);
        }
    }




    const onSubmit = (data) => {

        let _data = { ...data, password: "123", };
        let selectedClasses = classes.filter((cls) => cls.selected == true);

        if (selectedClasses.length == 0) {
            toast.error("Please select class to assign!")
            return
        }

        // if(!image) {
        //   toast.error("Please select teacher image.")
        //   return
        // }




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
                    if (image) {
                        uploadFile(d.created.id_no.toString())
                    }

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
                if (data.length != 0) {
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
                if (data.length != 0) {
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
                    <UploadDialog progress={uploadProgress.toString()} isOpen={isDialogOpen} onClose={handleCloseDialog} />
                    <h1 className="text-2xl font-bold mb-3">Add Visitor</h1>
                    <>
                        {classes.length == 0 ? (
                            <Alert
                                title="You have not added course yet!"
                                subtitle="To add visitor, create course first!"
                                link="/add-classes"
                                linktitle="Add"
                            />
                        ) : (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="border p-5 rounded"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
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
                                        Address
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
                                </div>

                                <div className="">
                                    <div className="mt-2 font-medium">
                                        Select course to interest:
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
                                </div>
                                <Button type="submit" size="sm" className="h-8 gap-1 mt-5">
                                    Add Visitor
                                </Button>
                            </form>
                        )}
                    </>
                </div>
            )}
        </>
    );
};

export default AddVisitor;
