import express from "express";

import {

  applyJob,

  getMyApplications,

  getJobApplications,

  updateApplicationStatus,

  getEmployerApplications,

} from "../controllers/applicationController.js";

import {

  protect,

  jobseekerOnly,

} from "../middleware/authMiddleware.js";

import employerOnly
from "../middleware/roleMiddleware.js";

const router =
  express.Router();


// ================= APPLY JOB =================

router.post(

  "/apply/:jobId",

  protect,

  jobseekerOnly,

  applyJob

);


// ================= GET MY APPLICATIONS =================

router.get(

  "/my",

  protect,

  jobseekerOnly,

  getMyApplications

);


// ================= EMPLOYER VIEW ALL APPLICATIONS =================

router.get(

  "/employer",

  protect,

  employerOnly,

  getEmployerApplications

);


// ================= EMPLOYER VIEW JOB APPLICANTS =================

router.get(

  "/job/:jobId",

  protect,

  employerOnly,

  getJobApplications

);


// ================= UPDATE APPLICATION STATUS =================

router.put(

  "/status/:id",

  protect,

  employerOnly,

  updateApplicationStatus

);

export default router;