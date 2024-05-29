import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImage, adminUpdate, formDate } from "@/lib/api";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import Loading from "@/components/app_components/Loading";
import toast from "react-hot-toast";
import axios from 'axios';
import UploadDialog from "@/components/app_components/UploadDialog";
import { AuthContext } from "@/Providers/AuthProvider";
const api_key = import.meta.env.VITE_apiKey;

const Settings = () => {
  const { admin, changeUserState } = useContext(AuthContext)
  const [isData, setIsData] = useState(true);
  const [image, setImage] = useState(null)
  const [image2, setImage2] = useState(null)
  const [isLogo, setIsLogo] = useState(false)
  const {
    register,
    handleSubmit,
    setValue, 
  } = useForm();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }; 
  const uploadFile = async (filename, image) => {
    setIsDialogOpen(true)
    const formData = new FormData();
    const ext = image.name.split(".").pop()
    const renamedFile = new File([image],`${filename}.${ext}`, {type: image.type})
    formData.append('image', renamedFile);
    try {
      const response = await axios.post(`${api_key}logo_upload`, formData, {
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
      toast.error(error)
      console.error('Error uploading file:', error);
    }
  };


  const onSubmit = (data) => {
    if(!image && !isLogo) {
      toast.error("Please select institution Logo.")
      return
    }
     data = {...data, inst_founding_date: new Date(data.inst_founding_date), info: true}
    //  console.log(data)

        toast.promise(
          adminUpdate(data, admin.id)
        .then((res) => res.json())
        .then((d) => {
          
          if (d.err) throw new Error(d.err);
          changeUserState({...d.updated})
          if(image){
            uploadFile("logo", image)
          }
          if(image2) {
            uploadFile("signature", image2)
          }


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

      

      getImage("inst", "logo")
      .then(res=> {
        if(!res.ok) {
          // console.log(res)
          setIsData(true)
          return
        }
        document.querySelector('#logo').src =res.url
        setIsData(true)
        setIsLogo(true)
      })
      .catch(err=> {
        console.log(err)
      })

      getImage("inst", "signature")
      .then(res=> {
        if(!res.ok) {
          // console.log(res)
          setIsData(true)
          return
        }
        document.querySelector('#logo2').src =res.url
        setIsData(true)
        setIsLogo(true)
      })
      .catch(err=> {
        console.log(err)
      })
  
      
  }, [setValue, admin]);

  const previewFile = () => {
    const preview = document.querySelector('#logo')
    const file = document.querySelector('input[type=file]').files[0]
    setImage(file)
    const reader = new FileReader()

    reader.addEventListener('load', ()=> {
      preview.src = reader.result;
    }, false)

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const previewFile2 = () => {
    const preview = document.querySelector('#logo2')
    const file = document.querySelector('#drop-zone2').files[0]
    setImage2(file)
    const reader = new FileReader()

    reader.addEventListener('load', ()=> {
      preview.src = reader.result;
    }, false)

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      {!isData ? (
        <Loading />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <UploadDialog progress={uploadProgress.toString()} isOpen={isDialogOpen} onClose={handleCloseDialog}/>
          <h1 className="text-2xl font-bold mb-3">Institute Information</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border p-5 rounded"
          >
            <div className="flex items-center justify-center">
              <label htmlFor="drop-zone">
              <div className="py-5 px-10 flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <input onChange={previewFile} id="drop-zone" className="hidden" type="file" accept="image/*"/>
              <img id="logo" className="h-[70px]" src="https://i.postimg.cc/rF77ZXQj/image.png"/>
              </div>
              </label>
            </div>
            <div className="font-medium text-center text-gray-600">Choose Institution Logo</div>

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
              <label htmlFor="drop-zone2">
              <div className="py-5 px-10  flex justify-center  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <input onChange={previewFile2} id="drop-zone2" className="hidden" type="file" accept="image/*"/>
              <img id="logo2" className="h-[70px]" src="https://i.postimg.cc/rF77ZXQj/image.png"/>
              </div>
              </label>
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
