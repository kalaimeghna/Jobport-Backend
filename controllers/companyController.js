import Company from "../models/Company.js";


// ================= CREATE COMPANY =================

export const createCompany =
  async (req, res) => {

    try {

      const {
        companyName,
        description,
        location,
        logo,
      } = req.body;


      // CHECK EXISTING COMPANY

      const companyExists =
        await Company.findOne({

          companyName,
        });

      if (companyExists) {

        return res.status(400).json({

          success: false,

          message:
            "Company already exists",
        });
      }


      // CREATE COMPANY

      const company =
        await Company.create({

          companyName,

          description,

          location,

          logo,

          createdBy:
            req.user._id,
        });


      res.status(201).json({

        success: true,

        message:
          "Company created successfully",

        company,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };


// ================= GET ALL COMPANIES =================

export const getCompanies =
  async (req, res) => {

    try {

      const companies =
        await Company.find()

          .populate(
            "createdBy",
            "name email"
          )

          .sort({
            createdAt: -1,
          });


      res.status(200).json({

        success: true,

        companies,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };


// ================= GET SINGLE COMPANY =================

export const getCompanyById =
  async (req, res) => {

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

          success: false,

          message:
            "Company not found",
        });
      }


      res.status(200).json({

        success: true,

        company,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };


// ================= UPDATE COMPANY =================

export const updateCompany =
  async (req, res) => {

    try {

      const {
        companyName,
        description,
        location,
        logo,
      } = req.body;


      const company =
        await Company.findById(
          req.params.id
        );


      if (!company) {

        return res.status(404).json({

          success: false,

          message:
            "Company not found",
        });
      }


      // CHECK OWNER

      if (

        company.createdBy.toString() !==
        req.user._id.toString()

      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized",
        });
      }


      // UPDATE

      company.companyName =
        companyName ||
        company.companyName;

      company.description =
        description ||
        company.description;

      company.location =
        location ||
        company.location;

      company.logo =
        logo ||
        company.logo;


      const updatedCompany =
        await company.save();


      res.status(200).json({

        success: true,

        message:
          "Company updated successfully",

        company:
          updatedCompany,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };


// ================= DELETE COMPANY =================

export const deleteCompany =
  async (req, res) => {

    try {

      const company =
        await Company.findById(
          req.params.id
        );


      if (!company) {

        return res.status(404).json({

          success: false,

          message:
            "Company not found",
        });
      }


      // CHECK OWNER

      if (

        company.createdBy.toString() !==
        req.user._id.toString()

      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized",
        });
      }


      await company.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Company deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };