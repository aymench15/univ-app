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
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ message: "Path parameter is required" });
    }

    // Decode the URL-encoded path
    const decodedPath = decodeURIComponent(path);
    console.log("Decoded path:", decodedPath);

    // Split the path to get branch hierarchy components
    const pathComponents = decodedPath.split("/");
    console.log("Path components:", pathComponents);

    // Extract components based on your hierarchy
    let [branch, department, specialty, subjectType, subject] = pathComponents;

    // Build the query object
    const query = { branch };

    // Match exact department name
    if (department) query.department = department;
    // Match exact subjectType name
    if (subjectType) query.subjectType = subjectType;
    // Match exact subject name
    if (subject) query.subject = subject;

    console.log("Query:", query);

    // Find users matching the criteria
    const users = await User.find({
      branch: query.branch,
      department: query.department,
      subjectType: query.subjectType,
      subject: query.subject,
    })
      .select("name email PhoneNumber branch department specialty subject subjectType _id")
      .lean();

    console.log("Found users:", users.length);

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No professors found for this path.",
        path: decodedPath,
        query: query, // Include query for debugging
      });
    }

    // Get user IDs
    const userIds = users.map((user) => user._id);

    // Fetch all documents for these users
    const allDocuments = await Document.find({
      userId: { $in: userIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found documents:", allDocuments.length);

    // Create a map of documents by userId
    const documentsByUser = {};
    allDocuments.forEach((doc) => {
      if (!documentsByUser[doc.userId]) {
        documentsByUser[doc.userId] = [];
      }
      documentsByUser[doc.userId].push({
        id: doc._id,
        name: doc.name,
        note: doc.note,
        size: doc.size,
        cloudinaryUrl: doc.cloudinaryUrl,
        createdAt: doc.createdAt,
      });
    });

    // Combine user data with their documents
    const contributions = users
      .map((user) => {
        const userDocs = documentsByUser[user._id] || [];
        if (userDocs.length === 0) return null;

        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          PhoneNumber:user.PhoneNumber,
          branch: user.branch,
          department: user.department,
          specialty: user.specialty,
          subject: user.subject,
          subjectType: user.subjectType,
          contributions: userDocs,
          lastContribution: userDocs[0]?.createdAt,
          totalDocuments: userDocs.length,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) => new Date(b.lastContribution) - new Date(a.lastContribution)
      );

    return res.status(200).json({
      path: decodedPath,
      contributions,
      totalprofessors: contributions.length,
      totalDocuments: allDocuments.length,
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({
      error: "Error fetching contributions",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getRandomFile = async (req, res) => {
  console.log("Getting random file", req.query);
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ message: "Path parameter is required" });
    }

    // Split the path into components
    const pathComponents = path.split("/");
    const [branch, department, specialty, subjectType, subject] =
      pathComponents;

    // Build the query dynamically
    const query = { branch };
    if (department) query.department = department;
    if (specialty) query.specialty = specialty;
    if (subjectType) query.subjectType = subjectType;
    if (subject) query.subject = subject;

    // Find users matching the query
    const users = await User.find({
      branch: query.branch,
      department: query.department,
      subjectType: query.subjectType,
      subject: query.subject,
    })
      .select("_id")
      .lean();
    if (!users.length) {
      return res
        .status(404)
        .json({ message: "No professors found for this path." });
    }

    // Get user IDs
    const userIds = users.map((user) => user._id);

    // Find documents for these users
    const documents = await Document.find({ userId: { $in: userIds } }).lean();

    if (!documents.length) {
      return res
        .status(404)
        .json({ message: "No documents found for this path." });
    }

    // Select a random file
    const randomFile = documents[Math.floor(Math.random() * documents.length)];

    // Find the user associated with the random file
    const user = await User.findById(randomFile.userId)
      .select("name email branch department specialty subject")
      .lean();

    return res.status(200).json({ document: randomFile, user });
  } catch (error) {
    console.error("Error fetching random file:", error);
    return res
      .status(500)
      .json({ message: "Error fetching random file", error: error.message });
  }
};

export const getEmails = async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addEmail = async (req, res) => {
  // Create new email instance
  const email = new Email({
    email: req.body.email,
  });

  try {
    // Check if request body contains email
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists before saving
    const existingEmail = await Email.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: `${req.body.email} is repeated` });
    }

    // Save with timeout to prevent hanging
    const savePromise = email.save();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Save operation timed out')), 5000);
    });

    const newEmail = await Promise.race([savePromise, timeoutPromise]);
    res.status(201).json(newEmail);

  } catch (error) {
    console.error('Error in addEmail:', error);

    // Handle duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: `${req.body.email} is repeated` 
      });
    }

    // Handle timeout error
    if (error.message === 'Save operation timed out') {
      return res.status(503).json({ 
        message: "Server is busy, please try again" 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Generic error handler
    res.status(400).json({ message: "Error adding emails" });
  }
};

export const deleteEmail = async (req, res) => {
  try {
    // Step 1: Find the email
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Step 2: Find the user by email
    const user = await User.findOne({ email: email.email });
    if (user) {
      // Step 3: Delete all documents associated with the user
      await Document.deleteMany({ userId: user._id });

      // Step 4: Delete the user
      await user.remove();
    }

    // Step 5: Delete the email
    await email.remove();

    res.json({
      message: "Email, user, and associated documents deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting email, user, or documents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const [totalDocuments, contributionsThisWeek, contributionsToday] =
      await Promise.all([
        Document.countDocuments(),
        Document.countDocuments({
          createdAt: {
            $gte: moment().startOf("week").toDate(),
            $lte: moment().endOf("week").toDate(),
          },
        }),

        Document.countDocuments({
          createdAt: {
            $gte: moment().startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
        }),
      ]);
    res.status(200).json({
      totalDocuments: Math.max(0, totalDocuments),
      contributionsThisWeek: Math.max(0, contributionsThisWeek),
      contributionsToday: Math.max(0, contributionsToday),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      error: "Failed to fetch statistics",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
