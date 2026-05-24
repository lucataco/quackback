import { z } from 'zod'

export const boardSettingsSchema = z
  .object({
    roadmapStatusIds: z.array(z.string()).optional(),
    appUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
    iconEmoji: z.string().max(16, 'Icon must be short').optional(),
    supportUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  })
  .strict()

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  settings: boardSettingsSchema.optional(),
})

export const updateBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100),
  description: z.string().max(500).optional(),
  settings: boardSettingsSchema.optional(),
})

export const deleteBoardSchema = z.object({
  confirmName: z.string(),
})

export type CreateBoardInput = z.input<typeof createBoardSchema>
export type CreateBoardOutput = z.infer<typeof createBoardSchema>
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>
export type DeleteBoardInput = z.infer<typeof deleteBoardSchema>
