import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminUpdate, formDate } from "@/lib/api";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import Loading from "@/components/app_components/Loading";
import toast from "react-hot-toast";

import { AuthContext } from "@/Providers/AuthProvider";

const Settings = () => {
  const { admin, changeUserState } = useContext(AuthContext)
  const [isData, setIsData] = useState(true);

  const {
    register,
    handleSubmit,
    setValue, 
  } = useForm();



 



  const onSubmit = (data) => {
 
     data = {...data, inst_founding_date: new Date(data.inst_founding_date), info: true}

        toast.promise(
          adminUpdate(data, admin.id)
        .then((res) => res.json())
        .then((d) => {
          
          if (d.err) throw new Error(d.err);
          changeUserState({...d.updated})

        }),
            {
              loading: 'Updating Settings...', 
              success: <b>Successfully Updated!</b>, 
              error: (error)=> <b>{error.message}</b>, 
            }
          )
  };

  useEffect(() => {
      if(admin) {
          setValue("inst_name",admin.inst_name);
          setValue("inst_phone", admin.inst_phone);
          setValue("inst_address", admin.inst_address);
          setValue("inst_email", admin.inst_email);
          setValue("inst_founding_date", formDate(admin.inst_founding_date));
          setValue("inst_eiin", admin.inst_eiin);
      } else {
        setValue("inst_name", "");
          setValue("inst_phone", "");
          setValue("inst_address", "");
          setValue("inst_email", "");
          setValue("inst_founding_date", "");
          setValue("inst_eiin", "");
      }
      setIsData(true)
  }, [setValue, admin]);

  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <h1 className="text-2xl font-bold mb-3">Institute Information</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border p-5 rounded"
          >
            <div className="flex items-center justify-center">
            <img id="logo" className="h-[70px]" src="./inst_logo.webp"/>
            </div>
         

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <label htmlFor="Name" className="md:col-span-1">
                Institute Name
                <Input
                  {...register("inst_name", { required: true })}
                  type="text"
                  name="inst_name"
                  placeholder="Name"
                  required
                />
              </label>
              <label htmlFor="Mobile Number" className="md:col-span-1">
                Mobile Number
                <Input
                  {...register("inst_phone", { required: true })}
                  type="number"
                  name="inst_phone"
                  placeholder="Mobile Number"
                  required
                />
              </label>
              <label htmlFor=" Address" className="md:col-span-1">
                Institute Address
                <Input
                  {...register("inst_address", { required: true })}
                  type="text"
                  name="inst_address"
                  placeholder="Address"
                  required
                />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <label htmlFor="Email" className="md:col-span-1">
                Institute Email
                <Input
                  {...register("inst_email", { required: true })}
                  type="email"
                  name="inst_email"
                  placeholder="Email"
                  required
                />
              </label>
              <label htmlFor="Joining Date" className="md:col-span-1">
                Founding Date
                <Input
                  {...register("inst_founding_date", { required: false })}
                  type="date"
                  name="inst_founding_date"
                  placeholder="Joining Date"
                />
              </label>
              <label htmlFor="NID Number" className="md:col-span-1">
                EIIN Number
                <Input
                  {...register("inst_eiin", { required: true })}
                  type="text"
                  name="inst_eiin"
                  placeholder="EIIN Number"
                  required
                />
              </label>
            </div>
            <div className="flex mt-5 flex-col w-[300px]">
            <img id="logo2" src="./sign.png"/>
             <div className="mt-3 font-medium text-gray-600">
              Signature of the Head of the Institute <div className="font-semibold text-sm">(This signature will be used in ID card also.)</div>
             </div>
            </div>
              <Button type="submit" size="sm" className="h-8 gap-1 mt-5">
                Update Information
              </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Settings;
