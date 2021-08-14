import bcrypt from "bcrypt";
import { revertData } from "../../lib/dbfuncprisma";

const authlinkindemo = process.env.AUTHLINKINDEMO;

async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(400).send("method not allowed");
    return;
  }

  try {
    console.log(req.headers);

    if (!req.headers.authlinkindemo) {
      res.status(401).json({ success: false, message: "invalid_credential" });
      return;
    }

    let pass = bcrypt.compareSync(req.headers.authlinkindemo, authlinkindemo);

    if (!pass) {
      res.status(401).json({ success: false, message: "invalid_credential" });
      return;
    }

    await revertData(req.body);

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);

    res.status(500).send(error.message);
  }
}

export default handler;
