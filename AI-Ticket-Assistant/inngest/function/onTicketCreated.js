import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import User from "../../models/user.model.js";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/aiAgent.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      // fetch ticket
      const ticket = await step.run("fetch ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId).lean();
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      // update ticket status to TODO
      await step.run("update ticket", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
      });

      // 🔥 Run analyzeTicket OUTSIDE step.run
      const aiResponse = await analyzeTicket(ticket);
      console.log(aiResponse);
      
      let relatedSkills = [];

      if (aiResponse) {
        await step.run("update ticket with ai data", async () => {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
        });

        relatedSkills = aiResponse.relatedSkills;
      }

      // assign moderator
      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join("|"),
              $options: "i",
            },
          },
        });

        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });

        return user;
      });

      // send email
      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned.",
            `A new Ticket has been assigned to you. Please resolve it as soon as possible.\n\nTitle: ${finalTicket.title}`
          );
        }
      });

      return { success: true };
    } catch (err) {
      console.error("Error running the steps", err.message);
      return { success: false };
    }
  }
);
