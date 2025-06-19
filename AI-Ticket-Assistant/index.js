import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import 'dotenv/config'
import {serve} from "inngest/express"
import userRouter from './routes/user.route.js'
import ticketRouter from './routes/ticket.route.js'
import {inngest} from "./inngest/client.js"
import {onSignup} from "./inngest/function/onSignup.js"
import {onTicketCreated} from "./inngest/function/onTicketCreated.js"

const PORT = process.env.PORT || 3001
const app = express()


app.use(cors())
app.use(express.json())
app.use("/api/auth", userRouter)
app.use("/api/ticket", ticketRouter)
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onSignup, onTicketCreated]
}))

mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Mongo DB is connected");
            app.listen(PORT, () => console.log(`Sever at htpp://localhost:${PORT}`))
        })
        .catch( (err) => console.log("Mongo DB err", err))