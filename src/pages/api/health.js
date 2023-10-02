export default function health(req, res) {
  res.statusCode = 200;
  res.json({ status: "OK" });
}
