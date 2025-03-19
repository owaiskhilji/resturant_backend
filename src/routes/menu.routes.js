import { Router } from "express"
import { menuController ,getMenu ,deleteMenu ,editMenu} from "../controllers/menu.controller.js"

const router = Router()

router.route("/menudata").post(menuController)
router.route("/getmenu").get(getMenu)
router.route("/deletemenu/:id").delete(deleteMenu);
router.route("/editmenu/:id").patch(editMenu);


export default router