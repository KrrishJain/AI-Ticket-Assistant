import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import User from "../../models/user.model.js";
import { sendMail } from "../../utils/mailer.js";

export const onSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const email = event.data.email;
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User not found in DB");
        }
        return userObject;
      });

      const subject = `Welcome to our app`;
      const message = `Hi ${user.email},\n\nThanks for signing up.`;

      await step.run("send-welcome-email", async () => {
        await sendMail(user.email, subject, message);
      });

      return { success: true };
    } catch (error) {
      console.log("Error in inngest", error.message);
      return { success: false };
    }
  }
);
