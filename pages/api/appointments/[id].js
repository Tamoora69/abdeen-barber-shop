import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const deleted = await Appointment.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
