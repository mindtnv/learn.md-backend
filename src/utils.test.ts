import { addDays, clearTime } from "./utils";

describe("addDays Tests", () => {
  test("Add zero days", () => {
    const date = new Date();
    expect(addDays(date, 0)).toStrictEqual(date);
  });
  test("Add positive days", () => {
    const date = new Date();
    const days = 2;
    const newDate = addDays(date, days);
    expect(newDate.getTime()).toBeGreaterThan(date.getTime());
    expect(newDate.getHours()).toBe(date.getHours());
    expect(newDate.getDay() % 7).toBe((date.getDay() + days) % 7);
  });
  test("Add negative days", () => {
    const date = new Date();
    const days = -2;
    const newDate = addDays(date, days);
    expect(newDate.getTime()).toBeLessThan(date.getTime());
    expect(newDate.getHours()).toBe(date.getHours());
    expect(newDate.getDay() % 7).toBe((date.getDay() + days) % 7);
  });
});

describe("clearTime Tests", () => {
  test("Create new object", () => {
    const date = new Date();
    const newDate = clearTime(date);
    expect(newDate).not.toBe(date);
  });
  test("Clear time", () => {
    const date = new Date();
    const newDate = clearTime(date);
    expect(newDate.getHours()).toBe(0);
    expect(newDate.getDay()).toBe(date.getDay());
  });
  test("TZ Clear time", () => {
    const date = new Date();
    const newDate = clearTime(date);
    const tzDate = new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000
    );
    expect(tzDate.getHours()).toBe(-newDate.getTimezoneOffset() / 60);
  });
});
