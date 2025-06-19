import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.model.js";
import mongoose from "mongoose";

export const createTicket = async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title || !description) {
      return res
        .status(401)
        .json({ message: "Title and description are required" });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      createdBy: req.user?._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket is created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating Ticket", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getTickets = async (req, res) => {
  // console.log("controller hittted");

  const user = req.user;
  try {
    let tickets = [];

    if (user?.role !== "user") {
      tickets = await Ticket.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id }) // ✅ missing await
        .select("title description status createdAt")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ tickets }); // ✅ wrap in an object
  } catch (error) {
    console.error("Error fetching Tickets", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id"])
        .lean();
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      })
        .select("title description status createdAt")
        .lean();
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching Ticket", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export const getAssignedTickets = async (req, res) => {
  console.log("endpoint hit");

  let tickets = []
  try {
    if (req.user.role === "moderator") {
       tickets = await Ticket.find({ assignedTo: req.user._id })
                        .select("title description status createdAt")
                        .sort({ createdAt: -1 });
       console.log(tickets);
    }
    
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No assigned tickets found" });
    }

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
