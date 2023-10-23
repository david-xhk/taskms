import { Router } from "express"

import { getPlan, updatePlan } from "../controllers/planController.js"
import { authorization } from "../middlewares/authMiddleware.js"
import { plan, updatePlanMiddleware, validatePlanParam } from "../middlewares/planMiddleware.js"

const router = Router({ mergeParams: true })

router.param("plan", validatePlanParam)

router.use("/:plan", plan)

router.get("/:plan", getPlan)

router.patch("/:plan", authorization("pm"), ...updatePlanMiddleware, updatePlan)

export default router
