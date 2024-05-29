import { Login } from "@/components/app_components/Login";

const LoginView = () => {

    return (
        <div className=" grid-cols-2">
        <div></div>
            <div className="flex w-full relative h-lvh items-center justify-center">
        <Login/>
        <div className="area absolute z-[-1]" >
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    </div>
        </div>
            
        </div>
    );
};

export default LoginView;