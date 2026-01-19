import z from "zod";
import { HydratedDocument, Types } from "mongoose";

export const EventSchema = z.object({
    title: z.string(),
    place: z.string().optional(),
    isAllDay: z.boolean(),
    startDateTime: z.iso.datetime(),
    endDateTime: z.iso.datetime(),
    rruleString: z.string(),
    description: z.string(),
    reminder: z.array(z.string()).optional(),
});

export type Event = z.infer<typeof EventSchema>;

export const IUserSchema = z.object({
    userId: z.string(),
    name: z.string(),
    profilePictureLink: z.string(),
});

type IUser = z.infer<typeof IUserSchema>;

export type UserDocument = HydratedDocument<IUser>;

export const IRefreshTokenSchema = z.object({
    user: z.instanceof(Types.ObjectId),
    tokenHash: z.string(),
    revoked: z.boolean(),
    expiresAt: z.number(),
});

type IRefreshToken = z.infer<typeof IRefreshTokenSchema>;

export type RefreshTokenDocument = HydratedDocument<IRefreshToken>;
