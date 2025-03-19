import { Router } from "express"
import { offerMenuController ,getofferMenu ,deleteOfferMenu ,editOfferMenu} from "../controllers/offermenu.controller.js"

const router = Router()

router.route("/offermenudata").post(offerMenuController)
router.route("/getoffermenu").get(getofferMenu)
router.route("/deletofferemenu/:id").delete(deleteOfferMenu);
router.route("/editoffermenu/:id").patch(editOfferMenu);


export default router