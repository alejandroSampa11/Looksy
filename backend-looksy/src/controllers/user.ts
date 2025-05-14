import { Request, Response } from "express";

export const getHealth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "OK" });
  } catch (err: any) {
    res.status(500).json({ message: "Sever Error" });
  }
};
