import addMinutes from "date-fns/addMinutes";
import format from "date-fns/format";

export const toLocalDate = (value: string) => {
  return addMinutes(new Date(value), new Date().getTimezoneOffset())
}

export const getUTCNow = () => {
  var now = new Date()
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes() - now.getTimezoneOffset(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )
  )
}

export const getEventDate = (eventStart: string) => {
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  let date = new Date(eventStart)
  return {
    day: weekday[date.getDay()],
    short: format(date, 'MMM d'),
    month: format(date, 'MMM'),
    dateOnly: format(date, 'yyyy-MM-dd'),
    dayOfMonth: format(date, 'd'),
    date,
    time: format(date, 'p'),
  }
}
