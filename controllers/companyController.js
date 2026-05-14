import Company from "../models/Company.js";

// Create Company
export const createCompany = async (
  req,
  res
) => {
  try {
    const {
      companyName,
      description,  
      location,
      logo,
    } = req.body;

    const company =
      await Company.create({
        companyName,
        description,
        location,
        logo,
        createdBy: req.user._id,
      });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Companies
export const getCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await Company.find().populate(
        "createdBy",
        "name email"
      );

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Company
export const getCompanyById = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name email"
      );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Company
export const updateCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
        req.params.id
      );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    company.companyName =
      req.body.companyName ||
      company.companyName;

    company.description =
      req.body.description ||
      company.description;

    company.location =
      req.body.location ||
      company.location;

    company.logo =
      req.body.logo || company.logo;

    const updatedCompany =
      await company.save();

    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Company
export const deleteCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
        req.params.id
      );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    await company.deleteOne();

    res.json({
      message: "Company deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};