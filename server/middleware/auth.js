import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided.");
    }

    jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          return res.status(401).json({
            message: "Token is invalid or expired.",
          });
        }

        const user = await userModel.findById(decodedToken.id);
        if (!user) {
          throw new Error("User not found.");
        }

        res.locals.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Error in checkUser middleware:", error);
    res.locals.user = null;
    return res.status(401).json({
      message: "User is not authenticated.",
    });
  }
};

// check current user
export const checkUser = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          res.locals.auth = false;
        } else if (decodedToken) {
          if (decodedToken.username === req.params["id"]) {
            res.locals.auth = true;
          } else {
            res.locals.auth = false;
          }
        } else {
          res.locals.auth = false;
        }
        next();
      }
    );
  } catch (error) {
    console.error("Error in checkUser middleware:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
