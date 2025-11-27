import LogSnag from "logsnag";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { event, description } = req.body;

  const logsnag = new LogSnag(process.env.e92753c8146e1e3ec929831f6f24a1b6);

  await logsnag.track({
    project: process.env.en-phi-sim,
    channel: "events",
    event,
    description,
    icon: "📡",
  });

  return res.status(200).json({ status: "logged" });
}
