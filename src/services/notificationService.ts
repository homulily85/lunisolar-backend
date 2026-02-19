import User from "../models/user";
import { GraphQLError } from "graphql/error";
import { EventDb } from "../type";
import { notificationQueue } from "../utils/notification";
import {
    calculateNotificationTimeNonRecurrence,
    calculateNotificationTimeRecurrence,
} from "../utils/calculateNotificationTime";
import generateRandomString from "../utils/randomString";

export const addFCMTokenToUser = async (userId: string, token: string) => {
    if (!userId || !token) {
        throw new GraphQLError("User ID and token are required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError("User not found", {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }

    if (!user.fcmTokens.includes(token)) {
        user.fcmTokens.push(token);
        await user.save();
    }
};

export const removeFCMTokenFromUser = async (userId: string, token: string) => {
    if (!userId || !token) {
        throw new GraphQLError("User ID and token are required", {
            extensions: {
                code: "BAD_USER_INPUT",
            },
        });
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new GraphQLError("User not found", {
            extensions: {
                code: "NOT_FOUND",
            },
        });
    }

    user.fcmTokens = user.fcmTokens.filter((t) => t !== token);
    await user.save();
};

export const scheduleNotificationForUser = async (
    userId: string,
    event: EventDb,
) => {
    const fcmTokens = await User.findById(userId).select("fcmTokens");
    if (!fcmTokens) {
        return;
    }

    event.reminder.push("0-min");

    await Promise.all(
        event.reminder.map(async (r) => {
            if (event.rruleString) {
                await notificationQueue.upsertJobScheduler(
                    `r-${event._id}-${r}-${generateRandomString()}`,
                    {
                        pattern: calculateNotificationTimeRecurrence(
                            event.rruleString,
                            r,
                        ),
                    },
                    {
                        data: {
                            title: event.title,
                            place: event.place,
                            description: event.description,
                            reminder: r,
                            fcmTokens: fcmTokens.fcmTokens,
                        },
                    },
                );
            } else {
                const notificationTime = calculateNotificationTimeNonRecurrence(
                    event.startDateTime,
                    r,
                );

                if (notificationTime.getTime() - Date.now() < 0) {
                    return;
                }

                await notificationQueue.add(
                    `${event._id}-${r}-${generateRandomString()}`,
                    {
                        title: event.title,
                        place: event.place,
                        description: event.description,
                        reminder: r,
                        fcmTokens: fcmTokens.fcmTokens,
                    },
                    {
                        delay: notificationTime.getTime() - Date.now(),
                        removeOnComplete: true,
                    },
                );
            }
        }),
    );
};

export const cancelNotificationForEvent = async (eventId: string) => {
    const schedulers = await notificationQueue.getJobSchedulers(0, -1);

    const eventSchedulers = schedulers.filter((s) => s.key.includes(eventId));

    await Promise.all(
        eventSchedulers.map((scheduler) =>
            notificationQueue.removeJobScheduler(scheduler.key),
        ),
    );

    const jobs = await notificationQueue.getJobs(["delayed", "waiting"]);

    const oneTimeJobs = jobs.filter((job) => {
        const isRepeatJob = job.name?.startsWith("r-");

        return !isRepeatJob;
    });

    await Promise.all(oneTimeJobs.map((job) => job.remove()));

    console.log(
        `Cancelled ${eventSchedulers.length} schedulers and ${oneTimeJobs.length} one-time jobs for event ${eventId}`,
    );
};
