import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    comments: { type: String, required: false },
});

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
