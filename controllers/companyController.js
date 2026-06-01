import Company from "../models/Company.js";
import Job from "../models/Job.js";

// ================= ROLE CHECK =================
const isEmployer = (req) => req.user?.role === "employer";

// ================= CREATE COMPANY =================
export const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      description,
      location,
      logo,
      website,
      industry,
      companySize,
      foundedYear,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can create company",
      });
    }

    if (!companyName || !description || !location || !industry) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingCompany = await Company.findOne({
      companyName: { $regex: `^${companyName}$`, $options: "i" },
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    const company = await Company.create({
      companyName,
      description,
      location,
      logo: logo || "",
      website: website || "",
      industry,
      companySize: companySize || "",
      foundedYear: foundedYear || "",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });

  } catch (error) {
    console.error("CREATE COMPANY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL COMPANIES =================
export const getCompanies = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const companies = await Company.find({
      companyName: { $regex: keyword, $options: "i" },
    })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {
    console.error("GET COMPANIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE COMPANY (FIXED) =================
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("createdBy", "name email role");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 });

    // 🔥 IMPORTANT FIX: attach jobs inside company
    const companyData = {
      ...company.toObject(),
      jobs,
      jobsCount: jobs.length,
    };

    res.status(200).json({
      success: true,
      company: companyData,
    });

  } catch (error) {
    console.error("GET COMPANY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE COMPANY =================
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can update company",
      });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const fields = [
      "companyName",
      "description",
      "location",
      "logo",
      "website",
      "industry",
      "companySize",
      "foundedYear",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    const updatedCompany = await company.save();

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });

  } catch (error) {
    console.error("UPDATE COMPANY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE COMPANY =================
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can delete company",
      });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // delete all jobs under company
    await Job.deleteMany({ company: company._id });

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });

  } catch (error) {
    console.error("DELETE COMPANY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MY COMPANIES =================
export const getMyCompanies = async (req, res) => {
  try {
    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can access this",
      });
    }

    const companies = await Company.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {
    console.error("MY COMPANIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};