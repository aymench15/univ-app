import Admin from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import Document from "../models/document.model.js";
import Email from "../models/acceptedEmails.model.js";
import moment from "moment";
export const getNotVerifiedDoctors = async (req, res) => {
  try {
    const notVerifiedDoctors = await Doctor.find({ isVerified: false }).lean();
    const doctorIds = notVerifiedDoctors.map((doctor) => doctor.userId);

    const users = await User.find({ _id: { $in: doctorIds } }, "img").lean();

    const doctorsWithImg = notVerifiedDoctors.map((doctor) => {
      const user = users.find(
        (user) => user._id.toString() === doctor.userId.toString()
      );
      return {
        ...doctor,
        img: user ? user.img : null,
      };
    });

    res.status(200).json(doctorsWithImg);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching not verified doctors",
      error: error.message,
    });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password").lean();
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const patients = await User.find()
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments();

    return res.status(200).json({
      data: patients,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

export const getContributions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Paginated users
    const users = await User.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .select("name email branch department specialty subject _id") // Ensure _id is included
      .lean();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No contributors found." });
    }

    // Fetch contributions for each user and filter those who have at least one contribution
    const contributions = await Promise.all(
      users.map(async (user) => {
        const userContributions = await Document.find({ userId: user._id })
          .sort({ createdAt: -1 }) // Order by latest first
          .lean();

        if (userContributions.length > 0) {
          return {
            ...user,
            contributions: userContributions.map((contribution) => ({
              id: contribution._id,
              name: contribution.name,
              note: contribution.note,
              size: contribution.size,
              cloudinaryUrl: contribution.cloudinaryUrl,
              createdAt: contribution.createdAt,
            })),
            lastContribution: userContributions[0].createdAt,
          };
        }

        // Exclude users with no contributions
        return null;
      })
    );

    // Filter out users without contributions
    const filteredContributions = contributions.filter((user) => user !== null);

    // Total count for pagination
    const totalCount = await User.countDocuments();

    res.status(200).json({
      contributions: filteredContributions,
      totalPages: Math.ceil(totalCount / limitNumber),
    });
  } catch (error) {
    console.error("Error fetching contributions: ", error);
    res.status(500).json({ error: "Error fetching contributions." });
  }
};

// export const getContributions = async (req, res) => {
//   console.log("reaches !");
//   console.log(req.query);
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       branch,
//       department,
//       specialty,
//       subjectType,
//       subject,
//     } = req.query;

//     // Ensure page and limit are numbers
//     const pageNumber = parseInt(page, 10);
//     const limitNumber = parseInt(limit, 10);

//     // Build query based on academic filters
//     const academicQuery = {};

//     if (branch) academicQuery["branch"] = { $regex: branch, $options: "i" }; // Case-insensitive search
//     if (department)
//       academicQuery["department"] = { $regex: department, $options: "i" }; // Case-insensitive search
//     if (specialty)
//       academicQuery["specialty"] = { $regex: specialty, $options: "i" }; // Case-insensitive search
//     if (subjectType)
//       academicQuery["subjectType"] = { $regex: subjectType, $options: "i" }; // Case-insensitive search
//     if (subject) academicQuery["subject"] = { $regex: subject, $options: "i" }; // Case-insensitive search

//     console.log("academic : ", academicQuery);
//     // First find users matching the academic criteria
//     const users = await User.find(academicQuery);
//     console.log("users : ", users);
//     if (!users || users.length === 0) {
//       return res.status(404).json({
//         message: "No contributors found matching the selected criteria.",
//       });
//     }

//     // Fetch contributions for each filtered user
//     const contributions = await Promise.all(
//       users.map(async (user) => {
//         const userContributions = await Document.find({ userId: user._id })
//           .sort({ createdAt: -1 }) // Order by latest first
//           .lean();

//         if (userContributions.length > 0) {
//           return {
//             ...user,
//             contributions: userContributions.map((contribution) => ({
//               id: contribution._id,
//               name: contribution.name,
//               note: contribution.note,
//               size: contribution.size,
//               cloudinaryUrl: contribution.cloudinaryUrl,
//               createdAt: contribution.createdAt,
//             })),
//             lastContribution: userContributions[0].createdAt,
//           };
//         }

//         // Exclude users with no contributions
//         return null;
//       })
//     );

//     console.log(contributions)
//     // Filter out users without contributions
//     const filteredContributions = contributions.filter((user) => user !== null);
//     console.log(filteredContributions)
//     // Get total count based on academic criteria for pagination
//     const totalCount = await User.countDocuments(academicQuery);
//     res.status(200).json({
//       contributions: filteredContributions,
//       totalPages: Math.ceil(totalCount / limitNumber),
//       currentPage: pageNumber,
//       totalContributors: totalCount,
//       filters: {
//         branch,
//         department,
//         specialty,
//         subjectType,
//         subject,
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching contributions: ", error);
//     res.status(500).json({
//       error: "Error fetching contributions.",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };
export const getEmails = async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addEmail = async (req, res) => {
  console.log("reached");
  const email = new Email({
    email: req.body.email,
  });

  try {
    const newEmail = await email.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (email) {
      await email.remove();
      res.json({ message: "Email deleted" });
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatistics = async (req, res) => {
  try {
    // Get total registered documents
    const totalDocuments = await Document.countDocuments();

    // Get the start and end of the current week (Monday to Sunday)
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    // Get the total contributions this week
    const contributionsThisWeek =
      (await Document.countDocuments({
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      })) - 1;

    // Get the start and end of today
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // Get the total contributions today
    const contributionsToday =
      (await Document.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })) - 1;

    res.status(200).json({
      totalDocuments: totalDocuments == 0 ? 0 : totalDocuments,
      contributionsThisWeek:
        contributionsThisWeek == 0 ? 0 : contributionsThisWeek,
      contributionsToday: contributionsToday == 0 ? 0 : contributionsToday,
    });
  } catch (error) {
    console.error("Error fetching statistics: ", error);
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
};
