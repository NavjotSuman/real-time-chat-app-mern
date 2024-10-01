import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefaultOptions, getColor } from '@/lib/utils'
import Lottie from 'react-lottie'
import axios from "axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedChatData, setSelectedChatType } from "@/store/chatSlice"



const NewDM = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState([])
  // const {selectedChatType,selectedChatData} = useSelector(store=>store.chat)
  const dispatch = useDispatch()

  const searchContacts = async (searchUser) => {
    try {
      if (searchUser.length > 0) {
        const res = await axios.post("/api/contacts/search", { searchUser }, { withCredentials: true })
        // console.log("Search Contact : ",res.data.contacts)
        setSearchedContacts(res.data.contacts)
      }
      else {
        setSearchedContacts([])
      }


    } catch (error) {
      console.log("Error at the search contact NewDM", error)
    }
  }

  const selectNewContact = (contact) => {
    try {
      setOpenNewContactModal(false)
      dispatch(setSelectedChatType("contact"))
      dispatch(setSelectedChatData(contact))
      setSearchedContacts([])
    } catch (error) {

    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger><FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModal(prev => !prev)} /></TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Add Friend
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Search a Contact</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => searchContacts(e.target.value)} />
          </div>
          {
            searchedContacts.length > 0 &&
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {
                  searchedContacts.map(contact => <div key={contact._id} onClick={() => selectNewContact(contact)} className="flex gap-3 items-center cursor-pointer">
                    <div className='h-12 w-12 relative'>
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={contact.image}
                            alt="Profile"
                            className="object-cover h-12 w-12 rounded-full bg-black"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>)
                }
              </div>
            </ScrollArea>
          }
          {
            searchedContacts.length <= 0 && <div className='flex-1 md:flex md:pt-0  flex-col justify-center items-center duration-1000 transition-all pt-12'>
              <Lottie isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions} />
              {/* <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
              <h3 className="poppins-medium">
                  Hi<span className='text-purple-500'>! </span> 
                  Welcome to 
                  <span className='text-purple-500'> Navjot's </span> 
                  Chat App<span className='text-purple-500'>.</span>
              </h3>
            </div> */}
            </div>
          }
        </DialogContent>
      </Dialog>


    </>
  )
}

export default NewDM