import { Router } from "express"

import { getPlan, updatePlan } from "../controllers/planController.js"
import { plan, updatePlanMiddleware, validatePlanParam } from "../middlewares/planMiddleware.js"

const router = Router({ mergeParams: true })

router.param("plan", validatePlanParam)

router.use("/:plan", plan)

router.get("/:plan", getPlan)

router.patch("/:plan", ...updatePlanMiddleware, updatePlan)

export default router
