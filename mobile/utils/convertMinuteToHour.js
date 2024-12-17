export default function convertMinuteToHour(minute) {
    if(minute < 60)
        return Math.round(minute)+ " min"

    let result = ""
    if(minute / 60 > 0)
        result = Math.floor(minute/60)

    return result + "," + Math.floor((minute % 60)) + " h"
}