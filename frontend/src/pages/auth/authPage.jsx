import React, { useState } from "react";
import Victory from "/assets/victory.svg";
import Background from "/assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/store/authSlice";

const AuthPage = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch()

    const navigator = useNavigate()

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                "/api/auth/login",
                { email, password },
                { withCredentials: true }
            );
            if (res.status == 200) {
                toast.success(res.data.message);
                dispatch(setUserInfo(res.data.user));
                setEmail("")
                setPassword("")
                setConfirmPassword("")
                navigator("/profile")
            }
            else{
                toast.error(res.data.error)
            }
            console.log(res);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };
    const handleSignup = async () => {
        try {
            setLoading(true)
            const res = await axios.post(
              "/api/auth/signup",
              { email, password, confirmPassword },
              { withCredentials: true }
            );
            if (res.status == 201) {
                toast.success(res.data.message);
                dispatch(setUserInfo(res.data.user))
                setEmail("")
                setPassword("")
                setConfirmPassword("")
                navigator("/profile")
            }
            else{
                toast.error(res.data.error);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center ">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold xl:text-6xl">Welcome</h1>
                            <img
                                src={Victory}
                                alt="victory Image"
                                className="h-[100px]"
                            />
                        </div>
                        <p className="font-medium text-center">
                            Fill in the details to get started with the best chat app!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs defaultValue="login" className="w-3/4">
                            <TabsList className="bg-transparent w-full rounded-none">
                                <TabsTrigger
                                    value="login"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    value="signup"
                                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="flex flex-col gap-5 mt-7">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {loading ? (
                                    <Button>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button onClick={handleLogin} className="rounded-full p-6">
                                        Login
                                    </Button>
                                )}
                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-5 ">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-6"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button onClick={handleSignup} className="rounded-full p-6">
                                    Signup
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img
                        src={Background}
                        alt="backgound Login"
                    // className="max-h-[600px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
