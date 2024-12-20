import moment from "moment"

export default function getPastTimeFromDate(date) {
    const newDate = new Date(date)

    const formattedDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
    var years = moment().diff(formattedDate, 'years');
    var months = moment().diff(formattedDate, 'months');
    var days = moment().diff(formattedDate, 'days');

    if(years > 0)
        return years == 1 ? years + " year ago" : years + " years ago"
    if(months > 0)
        return months == 1 ? months + " month ago" : months + " months ago"
    if(days > 0)
        return days == 1 ? days + " day ago" : days + " days ago"
}