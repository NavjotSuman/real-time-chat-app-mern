import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { getContactsForDMList, searchContacts } from "../controllers/contact.controller.js";
const contactRoutes = Router()

contactRoutes.post("/search",protectedRoute,searchContacts)
contactRoutes.get("/get-contacts-for-dm",protectedRoute,getContactsForDMList)

export default contactRoutes