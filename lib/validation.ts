import { z } from "zod";

export const fishSpeciesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  dropRate: z.coerce.number().min(0).max(100),
  sellPrice: z.coerce.number().int().min(0),
  imageUrl: z.string().optional(),
});
export type FishSpeciesFormInput = z.input<typeof fishSpeciesSchema>;
export type FishSpeciesFormOutput = z.output<typeof fishSpeciesSchema>;

export const rodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().int().min(0),
  luckBonus: z.coerce.number().int().min(0),
  imageUrl: z.string().optional(),
});
export type RodFormInput = z.input<typeof rodSchema>;
export type RodFormOutput = z.output<typeof rodSchema>;

export const roleSchema = z.enum(["player", "admin"]);
