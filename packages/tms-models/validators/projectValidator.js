import { createAsyncValidator } from "@han-keong/tms-validators/validators"

import ProjectModel from "../models/ProjectModel.js"

export const validateProjectExists = createAsyncValidator(ProjectModel.projectExists, "not found", "project")

export const validateProjectNotExists = createAsyncValidator(ProjectModel.projectNotExists, "already exists", "project")
