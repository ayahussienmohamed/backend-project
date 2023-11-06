const User = require("../models/userModel");
const Note = require("../models/noteModel");

const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
      return res.status(400).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
};

const addUser = async (req, res) => {
  console.log(req.body);
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await User.findOne({ username })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate) {
      return res.status(409).json({ message: "Duplicate username" });
    }

    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject =
      !Array.isArray(role) || !role.length
        ? { username, password: hashedPwd }
        : { username, password: hashedPwd, role };

    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `New user ${username} created` });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  const { id, username, role, active, password } = req.body;
  try {
    if (
      !id ||
      !username ||
      !Array.isArray(role) ||
      !role.length ||
      typeof active !== "boolean"
    ) {
      return res
        .status(400)
        .json({ message: "All fields except password are required" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const duplicate = await User.findOne({ username })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate username" });
    }

    user.username = username;
    user.role = role;
    user.active = active;

    if (password) {
      user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }
  try {
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
      return res.status(400).json({ message: "User has assigned notes" });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
};
