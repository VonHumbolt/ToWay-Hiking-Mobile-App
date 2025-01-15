export default function convertMilisecondToMinute(ms) {
    const min = ms * 0.00001666666666667
    if(min < 60)
        return Math.round(min)+ " min"

    let result = ""
    if(min / 60 > 0)
        result = Math.floor(min/60)

    return result + "," + Math.floor((min % 60)) + " h"
}