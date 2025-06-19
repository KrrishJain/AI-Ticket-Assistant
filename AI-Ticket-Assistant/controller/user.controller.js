import User from '../models/user.model.js'
import {inngest} from '../inngest/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    console.log("contronller hit");
    
    const {email, password, skills = [] } = req.body

    try {
        const hasedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            password: hasedPassword,
            skills
        })

        // fire inngest 
        await inngest.send({
            name: "user/signup",
            data: {
                email
            }
        })

        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET)
        
        res.json({user, token})

    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({error: "Error while signup", details: error.message})
    }
} 

export const login = async (req, res) => {
    const {email, password} = req.body 

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({error:"User not found"})
        }

        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({error: "Invaild credentials"})

        const token = jwt.sign({_id: user.id, role: user.role},process.env.JWT_SECRET)

        res.json({user, token})
    } catch (error) {
         res.status(500).json({error: "Error while login", details: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if(!token) return res.status(401).json({error: "Unauthorized"})

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(res) return res.status(401).json({error: "Unauthorized"})})
                res.json({message: "Logout successfully"})
    } catch (error) {
        res.status(500).json({error: "Error while logout", details: error.message})
    }
}

export const updateUser = async (req, res) => {
    const {skills = [], role, email} = req.body
    try {
        if(req.user?.role !== "admin"){
            return res.status(403).json({error: "Forbidden"});
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({error: "User not found"})
        }

        const updatedUser = await User.updateOne(
            {email},
            {skills: skills.length ? skills : user.skills, role }
        )

        return res.status(201).json({error: "User updated"})
    } catch (error) {
        res.status(500).json({error: "Error while updating user details", details: error.message})
    }
}

export const getUser = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password"); // <-- changed here
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error while getting users", details: error.message });
  }
};
