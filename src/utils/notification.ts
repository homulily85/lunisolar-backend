import { Queue, RepeatOptions, Worker } from "bullmq";
import { REDIS_HOST, REDIS_PORT } from "./config";
import { EventForNotification } from "../type";
import { getReminderTimeValue } from "./getReminderTimeValue";
import firebaseAdmin from "./firebase";
import { rrulestr } from "rrule";

const connection = {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
};

const settings = {
    repeatStrategy: (
        millis: number,
        opts: RepeatOptions,
        _jobName?: string,
    ) => {
        if (!opts.pattern) {
            throw new Error(
                "Recurrence pattern (opts.pattern) is required for repeat strategy",
            );
        }

        const lastExecutionRRuleTime = new Date(millis);
        lastExecutionRRuleTime.setHours(lastExecutionRRuleTime.getHours() + 7);

        const currentDate =
            opts.startDate && new Date(opts.startDate) > lastExecutionRRuleTime
                ? new Date(opts.startDate)
                : lastExecutionRRuleTime;

        const rrule = rrulestr(opts.pattern);

        const next_occurrence = rrule.after(currentDate, false);

        if (next_occurrence) {
            next_occurrence.setHours(next_occurrence.getHours() - 7);
            return next_occurrence.getTime();
        }

        return undefined;
    },
};

export const notificationQueue = new Queue("notification", {
    connection,
    settings,
});

export const notificationWorker = new Worker<EventForNotification>(
    "notification",
    async (job) => {
        const { title, place, description, reminder, fcmTokens } = job.data;
        const message = {
            notification: {
                title:
                    reminder === "0-min"
                        ? `${title} đã bắt đầu!`
                        : `${title} sẽ bắt đầu ${getReminderTimeValue(reminder)}`,
                body: `${place ? `Địa điểm: ${place}\n` : ""}${description}`,
            },
            tokens: fcmTokens,
        };

        await firebaseAdmin.messaging().sendEachForMulticast(message);
        console.log(
            `${new Date().toISOString()}: Notification sent for event: ${title} with reminder: ${reminder} to tokens: ${fcmTokens.join(", ")}`,
        );
    },
    {
        settings,
        connection,
        concurrency: 25,
        limiter: {
            max: 100,
            duration: 1000,
        },
    },
);
