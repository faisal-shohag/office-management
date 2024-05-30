import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClasses, getLastTeacher, getVisitors, teacherAdd, visitorsAdd } from "@/lib/api";
import { useForm } from "react-hook-form";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "@/components/app_components/Loading";
import Alert from "@/components/app_components/Alert";
import axios from "axios";
import UploadDialog from "@/components/app_components/UploadDialog";
import toast from "react-hot-toast";
import LatesVisitor from "./LatesVisitor";

const AddVisitor = () => {
    const {
        register,
        handleSubmit,
        setValue,
        // reset
    } = useForm();

    const [classes, setClasses] = useState([]);
    const [isData, setIsData] = useState(false);




    const onSubmit = (data) => {

        let _data = { ...data };
        let selectedClasses = classes.map((cls) => cls.name);

        if (selectedClasses.length == 0) {
            toast.error("Please select class to assign!")
            return
        }

        // Get Data
        _data = { ..._data, classes: selectedClasses }
        console.log(_data);

        toast.promise(
            visitorsAdd(_data)
                .then((res) => res.json())
                .then((d) => {
                    console.log(d)
                    if (d.err) throw new Error(d.err);
                }),
            {
                loading: "Adding visitor...",
                success: <b>Successfully added!</b>,
                error: (error) => <b>{error.message}</b>,
            }
        );
    };


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
    }, [setValue]);

    const handleClassSelect = (id) => {
        classes[id]["selected"] = !classes[id]["selected"];
        setClasses([...classes]);
    };

    const [visitors, setVisitors] = useState([])

    /* Get Latest Vistor */
    useEffect(() => {
        getVisitors()
            .then(res => res.json())
            .then(data => setVisitors((data)))
    }, [])

    return (
        <>
            {!isData ? (
                <Loading />
            ) : (
                <div style={{ overflow: "hidden" }}>
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
                                            {...register("address")}
                                            type="text"
                                            name="address"
                                            placeholder="Parmanent Address"
                                        />
                                    </label>
                                    <label htmlFor="Email" className="md:col-span-1">
                                        Email
                                        <Input
                                            {...register("email")}
                                            type="email"
                                            name="email"
                                            placeholder="Email"
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
                    <LatesVisitor visitors={visitors} />
                </div>
            )}
        </>
    );
};

export default AddVisitor;
