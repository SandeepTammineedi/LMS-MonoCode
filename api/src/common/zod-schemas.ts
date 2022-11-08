import { z } from "zod";

export const idSchema = z.preprocess(
  (value) => parseInt(value as string),
  z.number().min(1)
);

export const emailSchema = z.string().email();