import express from "express";
import passport from "passport";
import { User } from "../../../models/index.js";

const usersRouter = new express.Router();

usersRouter.post("/", async (req, res) => {
  const { firstName, email, password } = req.body;
  const validatedFirstName = firstName.trim() === "" ? null : firstName
  try {
    const persistedUser = await User.query().insertAndFetch({
       firstName: validatedFirstName, 
       email, 
       password 
      });
    return req.login(persistedUser, () => {
      return res.status(201).json({ user: persistedUser });
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ errors: error });
  }
});

export default usersRouter;
