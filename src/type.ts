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
    user: z.string(),
});

export type EventInput = z.infer<typeof EventSchema>;

export interface EventDb {
    user: Types.ObjectId;
    title: string;
    place?: string;
    isAllDay: boolean;
    startDateTime: Date;
    endDateTime: Date;
    rruleString: string;
    description: string;
    reminder?: string[];
}

export type IUser = {
    googleId: string;
    name: string;
    profilePictureLink: string;
    _id: Types.ObjectId;
};

export type IRefreshToken = {
    user: Types.ObjectId;
    tokenHash: string;
    revoked: boolean;
    expiresAt: number;
};

export interface TokenPayload extends JwtPayload {
    id: string;
    name: string;
    profilePictureLink: string;
    hashedContextString: string;
}
