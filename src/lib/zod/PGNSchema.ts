import { z } from "zod/v4"

export const PGNSchema = z.object({
	metadata: z.record(z.string(), z.string()),
	moves: z.array(z.string()),
})
export type PGNObject = z.infer<typeof PGNSchema>
export const validatePGN = (data: unknown) => PGNSchema.parse(data) as PGNObject
