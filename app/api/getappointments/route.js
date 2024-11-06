import connectMongo from "../../lib/mongoose";
import Appointment from "../../Models/Appointment";
export async function GET(req) {
    await connectMongo();

    try {
        const appointments = await Appointment.find();
        return new Response(JSON.stringify(appointments), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to retrieve appointments", error: error.message }), { status: 500 });
    }
}
