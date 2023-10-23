import { Router } from "express"

import { createPlan, getAllPlans } from "../controllers/plansController.js"
import { authorization } from "../middlewares/authMiddleware.js"
import { createPlanMiddleware } from "../middlewares/plansMiddleware.js"

const router = Router({ mergeParams: true })

router.get("/", getAllPlans)

router.post("/", authorization("pm"), ...createPlanMiddleware, createPlan)

export default router
