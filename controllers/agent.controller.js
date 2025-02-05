// import Agent from "../models/agent.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
dotenv.config();

const secretKey = process.env.secretKey;

export const agentRegister = async (req, res) => {
  try {
    console.log("agent body", req.body);
    const { name, email, sponsorId, password, phone } = req.body;

    if (!name || !email || !sponsorId || !password || !phone) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if agent already exists
    const existingAgent = await User.findOne({ email });
    if (existingAgent) {
      return res
        .status(400)
        .json({ message: "Agent already exists", success: false });
    }

    // Hash the password securely
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newAgent = new User({
      name,
      email,
      password: hashPassword,
      refer_id: sponsorId,
      role: "agent",
      phone,
    });

    await newAgent.save();

    res.json({
      message: "Agent created successfully",
      success: true,
      agent: newAgent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const agentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required", success: false });
    }

    const agent = await User.findOne({ email });
    if (!agent) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, agent.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign(
      { id: agent._id, role: "agent" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: false,
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        success: true,
        token,
        agent,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getAgentInfo = async (req, res) => {
  try {
    const agent = req.agent;
    // console.log("agent info ", agent);
    if (!agent) {
      return res
        .status(404)
        .json({ message: "Agent not found", success: false });
    }
    res.json({ user:agent, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getUserPairs = async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await User.findById(agentId);
    if (!agent) {
      return res
        .status(404)
        .json({ message: "Agent not found", success: false });
    }
    let leftUsers = agent.left || [];
    let rightUsers = agent.right || [];

    const result = {
      leftUsers: [],
      rightUsers: [],
    };

    let leftPointer = 0;
    let rightPointer = 0;

    // Set to track already used user IDs
    const usedUserIds = new Set();

    const fetchAllSubChildren = async (userId) => {
      const user = await User.findById(userId);
      const allChildren = [];
      if (user) {
        if (user.left) {
          for (const child of user.left) {
            if (!usedUserIds.has(child._id.toString())) {
              allChildren.push(child);
              usedUserIds.add(child._id.toString());
              allChildren.push(...(await fetchAllSubChildren(child._id)));
            }
          }
        }
        if (user.right) {
          for (const child of user.right) {
            if (!usedUserIds.has(child._id.toString())) {
              allChildren.push(child);
              usedUserIds.add(child._id.toString());
              allChildren.push(...(await fetchAllSubChildren(child._id)));
            }
          }
        }
      }
      return allChildren;
    };

    while (leftPointer < leftUsers.length && rightPointer < rightUsers.length) {
      result.leftUsers.push(leftUsers[leftPointer]);
      result.rightUsers.push(rightUsers[rightPointer]);
      usedUserIds.add(leftUsers[leftPointer]._id.toString());
      usedUserIds.add(rightUsers[rightPointer]._id.toString());
      leftPointer++;
      rightPointer++;
    }

    if (leftPointer < leftUsers.length) {
      while (leftPointer < leftUsers.length) {
        const subChildren = [];

        for (const user of rightUsers) {
          subChildren.push(...(await fetchAllSubChildren(user._id)));
        }

        if (subChildren.length === 0) break;

        result.leftUsers.push(leftUsers[leftPointer]);
        result.rightUsers.push(subChildren.shift());
        usedUserIds.add(leftUsers[leftPointer]._id.toString());
        leftPointer++;
      }
    }

    if (rightPointer < rightUsers.length) {
      while (rightPointer < rightUsers.length) {
        const subChildren = [];

        for (const user of leftUsers) {
          subChildren.push(...(await fetchAllSubchildren(user._id)));
        }

        if (subChildren.length === 0) break;

        result.leftUsers.push(subChildren.shift());
        result.rightUsers.push(rightUsers[rightPointer]);
        usedUserIds.add(rightUsers[rightPointer]._id.toString());
        rightPointer++;
      }
    }

    // Check if balance is maintained

    let leftCount = 0;
    let rightCount = 0;

    for (const leftUser of result.leftUsers) {
      leftCount +=
        (leftUser.left ? leftUser.left.length : 0) +
        (leftUser.right ? leftUser.right.length : 0);
    }

    for (const rightUser of result.rightUsers) {
      rightCount +=
        (rightUser.left ? rightUser.left.length : 0) +
        (rightUser.right ? rightUser.right.length : 0);
    }

    if (leftCount !== rightCount) {
      // Balance is not maintained, get left and right children of the agent

      let leftChildren = [];
      let rightChildren = [];

      for (const leftUser of leftUsers) {
        leftChildren.push(...(await fetchAllSubchildren(leftUser._id)));
      }

      for (const rightUser of rightUsers) {
        rightChildren.push(...(await fetchAllSubchildren(rightUser._id)));
      }

      result.leftUsers = result.leftUsers.concat(leftChildren);
      result.rightUsers = result.rightUsers.concat(rightChildren);
    }

    return res.status(200).json({
      message: "User pairs fetched successfully",
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
export const getTree = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Fetch the root user
    const rootUser = await User.findById(agentId);
    if (!rootUser) {
      return res
        .status(404)
        .json({ message: "Agent not found", success: false });
    }

    // Helper function to recursively build the tree and fetch left/right nodes manually
    const buildTree = async (user) => {
      if (!user) return null;

      // Fetch the left and right children (manually populate)
      const leftChildren = user.left
        ? await Promise.all(user.left.map((childId) => fetchChild(childId)))
        : [];
      const rightChildren = user.right
        ? await Promise.all(user.right.map((childId) => fetchChild(childId)))
        : [];

      return {
        id: user._id,
        name: user.name || "Unknown",
        left: leftChildren,
        right: rightChildren,
      };
    };

    // Helper function to fetch a child user and recursively populate its left and right
    const fetchChild = async (childId) => {
      const childUser = await User.findById(childId);
      if (!childUser) return null;

      const leftChildren = childUser.left
        ? await Promise.all(
            childUser.left.map((childId) => fetchChild(childId))
          )
        : [];
      const rightChildren = childUser.right
        ? await Promise.all(
            childUser.right.map((childId) => fetchChild(childId))
          )
        : [];

      return {
        id: childUser._id,
        name: childUser.name || "Unknown",
        left: leftChildren,
        right: rightChildren,
      };
    };

    // Build the full tree starting from the root user
    const tree = await buildTree(rootUser);

    return res.status(200).json({
      message: "Tree fetched successfully",
      success: true,
      tree,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
