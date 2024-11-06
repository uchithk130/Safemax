import connectMongo from "../../lib/mongoose";
import Appointment from "../../models/Appointment";

export async function POST(req) {
    await connectMongo();

    try {
        const data = await req.json();
        const { name, email, date, time, comments } = data;

        const newAppointment = new Appointment({
            name,
            email,
            date,
            time,
            comments,
        });

        await newAppointment.save();

        return new Response(JSON.stringify({ message: "Appointment created successfully" }), {
            status: 201,
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to create appointment", error: error.message }), {
            status: 500,
        });
    }
}
