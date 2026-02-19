import z from "zod";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const reminderEmum = z.enum([
    "0-min",
    "5-min",
    "10-min",
    "15-min",
    "30-min",
    "1-hour",
    "2-hour",
    "6-hour",
    "12-hour",
    "1-day",
    "2-day",
    "3-day",
    "1-week",
    "2-week",
    "1-month",
]);

export type ReminderOption = z.infer<typeof reminderEmum>;

export const EventSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    place: z.string().optional(),
    isAllDay: z.boolean(),
    startDateTime: z.iso.datetime(),
    endDateTime: z.iso.datetime(),
    rruleString: z.string(),
    description: z.string(),
    reminder: z.array(reminderEmum),
});

export type EventInput = z.infer<typeof EventSchema>;

export interface EventDb {
    _id: string;
    user: Types.ObjectId;
    title: string;
    place?: string;
    isAllDay: boolean;
    startDateTime: Date;
    endDateTime: Date;
    rruleString: string;
    description: string;
    reminder: ReminderOption[];
}

export type IUser = {
    googleId: string;
    name: string;
    profilePictureLink: string;
    _id: Types.ObjectId;
    fcmTokens: string[];
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

export type EventForNotification = {
    title: string;
    place?: string;
    description: string;
    reminder: ReminderOption;
    fcmTokens: string[];
};
