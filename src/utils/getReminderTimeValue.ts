import { ReminderOption } from "../type";

const reminderTime = [
    { key: "0-min", value: "" },
    { key: "5-min", value: "sau 5 phút" },
    { key: "10-min", value: "sau 10 phút" },
    { key: "15-min", value: "sau 15 phút" },
    { key: "30-min", value: "sau 30 phút" },
    { key: "1-hour", value: "sau 1 giờ" },
    { key: "2-hour", value: "sau 2 giờ" },
    { key: "6-hour", value: "sau 6 giờ" },
    { key: "12-hour", value: "sau 12 giờ" },
    { key: "1-day", value: "sau 1 ngày" },
    { key: "2-day", value: "sau 2 ngày" },
    { key: "3-day", value: "sau 3 ngày" },
    { key: "1-week", value: "sau 1 tuần" },
    { key: "2-week", value: "sau 2 tuần" },
    { key: "1-month", value: "sau 1 tháng" },
];

export const getReminderTimeValue = (key: ReminderOption) => {
    return reminderTime.find((option) => option.key === key)?.value;
};
