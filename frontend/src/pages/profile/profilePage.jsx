import { Button } from "@/components/ui/button";
import { setUserInfo } from "@/store/authSlice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

const ProfilePage = () => {
  const fileInputRef = useRef(null)
  const navigate = useNavigate();
  const { userInfo } = useSelector((store) => store.auth);
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(userInfo?.image || "");
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo?.color || 0);
  const dispatch = useDispatch()

  // TODO : optimize eveything
  // userInfo called evertime when state chnage fix it

  const saveChanges = async () => {
    try {
      const res = await axios.post("/api/auth/updateProfile", { firstName, lastName, color: selectedColor }, { withCredentials: true })
      // console.log(res)
      if (res.status === 200 && res.data) {
        toast.success(res.data.message)
        dispatch(setUserInfo({ ...res.data.user }))
        // console.log({...res.data.user})
        navigate("/chat")
      }
      else {
        toast.error("somthing went wrong!")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.error)
    }
  };

  const handleNavigate = async () => {
    if (userInfo.profileSetup) {
      navigate("/chat")
    } else {
      toast.warning("You must setup your Profile first!!")
    }
  }

  const fileInputHandleCLick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    console.log({ file })
    if (file) {
      const formData = new FormData()
      formData.append("profile-image", file)

      const res = await axios.post("/api/auth/updateProfileImage", formData, { withCredentials: true })
      console.log(res)
      if (res.status === 200 && res.data.user.image) {
        dispatch(setUserInfo({ ...userInfo, image: res.data.user.image }))
        toast.success(res.data.message)
      }

    }


  }

  const handleDeleteImage = async () => {
    try {
      const res = await axios.post("/api/auth/updateProfileImage_remove")
      console.log(res)
      if (res.status === 200) {
        dispatch(setUserInfo({ ...userInfo, image: "" }))
        toast.success(res.data.message)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    setImage(userInfo?.image)
  }, [userInfo])

  console.log("User-info at ProfilePage : ", userInfo)

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          {/* Arrow Back */}
          <IoArrowBack onClick={handleNavigate} className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div onClick={image ? handleDeleteImage : fileInputHandleCLick} className="absolute inset-0 flex items-center bg-black/50 justify-center ring-fuchsia-50 rounded-full">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept=".png, .jpg, .jpeg, .svg, .webp" name="profile-image" />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="tet"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors?.map((color, index) => <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-white/50 outline-1" : ""}`} key={index} onClick={() => setSelectedColor(index)}></div>)}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
