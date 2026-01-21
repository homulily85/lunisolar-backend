import z from "zod";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

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

export type EventInput = z.infer<typeof EventSchema>;

export interface EventDb {
    title: string;
    place?: string;
    isAllDay: boolean;
    startDateTime: Date;
    endDateTime: Date;
    rruleString: string;
    description: string;
    reminder?: string[];
}

export const UserSchema = z.object({
    userId: z.string(),
    name: z.string(),
    profilePictureLink: z.string(),
});

export type IUser = z.infer<typeof UserSchema>;

export const RefreshTokenSchema = z.object({
    user: z.instanceof(Types.ObjectId),
    tokenHash: z.string(),
    revoked: z.boolean(),
    expiresAt: z.number(),
});

export type IRefreshToken = z.infer<typeof RefreshTokenSchema>;

export interface TokenPayload extends JwtPayload {
    userId: string;
    name: string;
    profilePictureLink: string;
    contextString: string;
}
