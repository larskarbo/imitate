import { Request, Response } from "express";
import forceEnv from "force-env";
import { getErrorMessage } from "get-error-message";
import superagent from "superagent";

export default async function newsLetter(req: Request, res: Response) {
  const email = req.body.email;

  superagent
    .post(forceEnv("SENDY_URL"))
    .type("form")
    .send({ api_key: forceEnv("SENDY_API") })
    .send({ email: email })
    .send({ list: forceEnv("SENDY_LIST") })
    .send({ isFrenchLearner: "yes" })
    .then(
      function () {
        res.status(200).json({ message: "success" });
      },
      (err) => {
        return res.status(500).json({ message: getErrorMessage(err) });
      }
    );
}
