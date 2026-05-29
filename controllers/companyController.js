import Company from "../models/Company.js";
import Job from "../models/Job.js";

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

    // 🔐 CHECK AUTH
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ❌ REQUIRED FIELDS CHECK
    if (!companyName || !description || !location || !industry) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 🔍 DUPLICATE CHECK
    const existing = await Company.findOne({
      companyName: { $regex: `^${companyName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    // 🆕 CREATE COMPANY
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE COMPANY =================
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

    const jobs = await Job.find({
      company: company._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      company,
      jobs,
    });

  } catch (error) {
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

    const updated = await company.save();

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updated,
    });

  } catch (error) {
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

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // delete related jobs
    await Job.deleteMany({ company: company._id });

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= MY COMPANIES =================
export const getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};