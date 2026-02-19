import { ReminderOption } from "../type";
import { rrulestr } from "rrule";

export const calculateNotificationTimeNonRecurrence = (
    startDateTime: number | Date,
    reminderType: ReminderOption,
) => {
    const notificationTime = new Date(startDateTime);
    switch (reminderType) {
        case "0-min":
            break;
        case "5-min":
            notificationTime.setMinutes(notificationTime.getMinutes() - 5);
            break;
        case "10-min":
            notificationTime.setMinutes(notificationTime.getMinutes() - 10);
            break;
        case "15-min":
            notificationTime.setMinutes(notificationTime.getMinutes() - 15);
            break;
        case "30-min":
            notificationTime.setMinutes(notificationTime.getMinutes() - 30);
            break;
        case "1-hour":
            notificationTime.setHours(notificationTime.getHours() - 1);
            break;
        case "2-hour":
            notificationTime.setHours(notificationTime.getHours() - 2);
            break;
        case "6-hour":
            notificationTime.setHours(notificationTime.getHours() - 6);
            break;
        case "12-hour":
            notificationTime.setHours(notificationTime.getHours() - 12);
            break;
        case "1-day":
            notificationTime.setDate(notificationTime.getDate() - 1);
            break;
        case "2-day":
            notificationTime.setDate(notificationTime.getDate() - 2);
            break;
        case "3-day":
            notificationTime.setDate(notificationTime.getDate() - 3);
            break;
        case "1-week":
            notificationTime.setDate(notificationTime.getDate() - 7);
            break;
        case "2-week":
            notificationTime.setDate(notificationTime.getDate() - 14);
            break;
        case "1-month":
            notificationTime.setMonth(notificationTime.getMonth() - 1);
            break;
    }
    return notificationTime;
};

export const calculateNotificationTimeRecurrence = (
    rrulestring: string,
    reminderType: ReminderOption,
) => {
    const rrule = rrulestr(rrulestring);
    switch (reminderType) {
        case "0-min":
            return rrulestring;
        case "5-min":
            rrule.options.dtstart.setMinutes(
                rrule.options.dtstart.getMinutes() - 5,
            );
            break;
        case "10-min":
            rrule.options.dtstart.setMinutes(
                rrule.options.dtstart.getMinutes() - 10,
            );
            break;
        case "15-min":
            rrule.options.dtstart.setMinutes(
                rrule.options.dtstart.getMinutes() - 15,
            );
            break;
        case "30-min":
            rrule.options.dtstart.setMinutes(
                rrule.options.dtstart.getMinutes() - 30,
            );
            break;
        case "1-hour":
            rrule.options.dtstart.setHours(
                rrule.options.dtstart.getHours() - 1,
            );
            break;
        case "2-hour":
            rrule.options.dtstart.setHours(
                rrule.options.dtstart.getHours() - 2,
            );
            break;
        case "6-hour":
            rrule.options.dtstart.setHours(
                rrule.options.dtstart.getHours() - 6,
            );
            break;
        case "12-hour":
            rrule.options.dtstart.setHours(
                rrule.options.dtstart.getHours() - 12,
            );
            break;
        case "1-day":
            rrule.options.dtstart.setDate(rrule.options.dtstart.getDate() - 1);
            break;
        case "2-day":
            rrule.options.dtstart.setDate(rrule.options.dtstart.getDate() - 2);
            break;
        case "3-day":
            rrule.options.dtstart.setDate(rrule.options.dtstart.getDate() - 3);
            break;
        case "1-week":
            rrule.options.dtstart.setDate(rrule.options.dtstart.getDate() - 7);
            break;
        case "2-week":
            rrule.options.dtstart.setDate(rrule.options.dtstart.getDate() - 14);
            break;
        case "1-month":
            rrule.options.dtstart.setMonth(
                rrule.options.dtstart.getMonth() - 1,
            );
            break;
    }
    return rrule.toString();
};
