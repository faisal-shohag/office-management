import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/Providers/AuthProvider";
import { Eye, EyeOff } from "lucide-react";
import {  useEffect, useRef, useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [eye, setEye] = useState(false);

  const {user, signIn} = useContext(AuthContext)
  const handleEye = () => {
    setEye(!eye);
  };

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate()
  const handleLogin = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    
      toast.promise(
        signIn(email, password)
        .then((result) => {
          console.log(result.user);
          navigate("/");
        }),
        {
          loading: "Loggin In....",
          success: <b>Logged In</b>,
          error: (error) => { 
            console.log("error", error)
            if(error.message == "Failed to fetch")
              return <b>Unable to connect with server!</b>
            return <b>{error.message}</b>
          } ,
        }
      );
  };
  return (
    <>
      <Card className="w-[400px] mt-10 custom-glass ">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription className="text-black">Login with your email and password!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-left" htmlFor="email">
                Email
              </Label>
              <Input
                name="email"
                id="email"
                type="email"
                ref={emailRef}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
              </div>
              <div className="flex gap-3 items-center relative">
                <Input
                  ref={passwordRef}
                  name="password"
                  id="password"
                  placeholder="Password"
                  type={eye ? "text" : "password"}
                  required
                />
                <div
                  onClick={handleEye}
                  className="absolute right-4 cursor-pointer"
                >
                  {eye ? <EyeOff size="20" /> : <Eye size={20} />}
                </div>
              </div>
            </div>
            <CardFooter>
              <Button  onClick={handleLogin} type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
