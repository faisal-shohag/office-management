import { Earth, Home, Mail, PhoneCall } from "lucide-react";

const IdCard = () => {
    return (
        <div>
        <div className=" flex justify-center flex-wrap gap-10 mt-10">

            <div className="shadow-lg p-5 relative h-[700px] w-[500px] border">
                <div className="bg-black h-[40%]"></div>
                
                <div className="h-[250px] w-[250px] border-[10px] border-white bg-black rounded-full absolute top-[21%] left-[25%] overflow-hidden">
                <img className="h-[250px] w-[250px]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHxUUQykf7SRL0PjPsBvhDZYBLU9UB_ISd8IsO7o31Ag&s"/>

                </div>
                <div className=" text-center   text-black">
                    <div className="mt-[150px] text-black text-3xl font-bold">Tonmoy Sarkar</div>
                    <div className="mt-3 text-xl">Graphic Designer</div>
                    <div className="mt-3 text-xl font-bold">Batch: 086</div>
                    <div className="mt-14 flex justify-center grayscale"><img className="h-[60px]" src="https://i0.wp.com/inspireditbd.com/wp-content/uploads/2023/07/logo-scaled.webp?fit=512%2C120&ssl=1"/></div>
                </div>
            </div>
            

            <div className="shadow-lg p-5 relative h-[700px] w-[500px] border text-center">
               
                <div className="uppercase text-center mt-7 font-bold text-3xl">Internship Details</div>
               

               <div className="flex justify-center mt-10 flex-col items-center text-left">

               <table>
                <tr>
                    <td>Father&apos;s Name</td>
                    <td className="pl-5">:</td>
                    <td className="pl-5">Sharif</td>
                </tr>
                <tr>
                    <td>Mother&apos;s Name</td>
                    <td className="pl-5">:</td>
                    <td className="pl-5">Sharifa</td>
                </tr>

                <tr>
                    <td>Blood Group</td>
                    <td className="pl-5">:</td>
                    <td className="pl-5">AB+</td>
                </tr>

                <tr>
                    <td>Mobile Number</td>
                    <td className="pl-5">:</td>
                    <td className="pl-5">+8801318067123</td>
                </tr>
                <tr>
                    <td>Address</td>
                    <td className="pl-5">:</td>
                    <td className="pl-5">Park More, Rangpur</td>
                </tr>

               </table>


               <div className="absolute bottom-0   flex flex-col items-center justify-center w-full">
                <div className="font-bold text-2xl text-center ">Company Information</div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm px-3">
                    <div className="flex gap-3 items-center"> 
                        <div ><Mail size={16}/></div>
                        <div>inspireditbd@gmail.com</div>
                    </div>

                    <div className="flex gap-3 items-center"> 
                        <div ><Home size={16}/></div>
                        <div className="text-[12px]">Chartola more, Apex Building, College Rd, Rangpur 5400</div>
                    </div>


                    <div className="flex gap-3 items-center"> 
                        <div ><Earth size={16}/></div>
                        <div>inspireditbd.com</div>
                    </div>

                    <div className="flex gap-3 items-center"> 
                        <div ><PhoneCall size={16}/></div>
                        <div>01318-067123</div>
                    </div>

                  
                    
                    
                </div>
                <div className="h-1 bg-black w-[200px] mt-10 mb-2"></div>
                
                <div className="font-bold">Founder</div>

                <div style={{borderTopLeftRadius: "80px", borderTopRightRadius: "80px"}} className=" w-full bg-black left-0 mt-10 flex justify-center py-3">

                    <img className="h-[80px]" src="https://i.pinimg.com/736x/a8/69/40/a86940a4ed8a69539b341f3c414c47b3.jpg"/>

                </div>
               </div>




               </div>
            </div>

            
        </div>
        </div>
        
    );
};

export default IdCard;