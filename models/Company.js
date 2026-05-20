import mongoose from "mongoose";


const companySchema =
  new mongoose.Schema(

    {
      companyName: {

        type: String,

        required: true,
      },

      description: {

        type: String,
      },

      logo: {

        type: String,
      },

      location: {

        type: String,
      },

      createdBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Company",
  companySchema
);