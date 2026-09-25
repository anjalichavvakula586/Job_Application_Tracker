const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    location: {
      type: String,
      default: "Remote",
    },

    status: {
      type: String,
      default: "Saved",
    },

    salary: {
      type: String,
      default: "",
    },

    appliedDate: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      default: "Full Time",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);