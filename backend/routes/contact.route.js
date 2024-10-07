import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/contact.controller.js";
const contactRoutes = Router()

contactRoutes.post("/search",protectedRoute,searchContacts)
contactRoutes.get("/get-contacts-for-dm",protectedRoute,getContactsForDMList)
contactRoutes.get("/get-all-contacts",protectedRoute,getAllContacts)

export default contactRoutes