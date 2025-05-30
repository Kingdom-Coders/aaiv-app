export const getRelativeTime = (date) => {
    var curr = new Date();
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    if (date.toString() == "Invalid Date") {
        return "Invalid Date";
    }
    var timeDifferenceSecs = (Date.now() - date.getTime()) / 1000;
    var yesterday = new Date();
    yesterday.setDate(curr.getDate() - 1);
    var lastWeek = new Date();
    lastWeek.setDate(curr.getDate() - 7);
    const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    if(timeDifferenceSecs < 0) {
        return "Futuristic";
    } if (timeDifferenceSecs < 60) {
        return "Just now";
    } else if ((timeDifferenceSecs / 60) < 60) {
        return (timeDifferenceSecs / 60) + "minutes ago";
    } else if ((timeDifferenceSecs / 60 / 60) < 24) {
        return (timeDifferenceSecs / 60 / 60) + "hours ago";
    } else if (yesterday.toDateString() === date.toDateString()) {
        return "Yesterday";
    } else if (lastWeek.getTime() < date.getTime()){
        return Math.ceil((curr.getTime - date.getTime()) / 1000 / 60 / 60 / 24) + " days ago"
    } else if (curr.getFullYear() == date.getFullYear()) {
        return monthNames[date.getMonth()] + " " + date.getDate();
    } else {
        return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getYear();
    }
}

export const formatShortDate = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    if (date.toString() == "Invalid Date") {
        return "Invalid Date";
    }

    const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getYear();
}

export const formatFullDate = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    if (date.toString() == "Invalid Date") {
        return "Invalid Date";
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getYear() + " at " + formatTimeOnly(date);
}

export const formatTimeOnly = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    if (date.toString() == "Invalid Date") {
        return "Invalid Date";
    }

    if (date.getHour() == 0) {
        return "12" + ":" + date.getMinute() + " AM";
    } else if (date.getHour() < 12) {
        return date.getHour() + ":" + date.getMinute() + "AM";
    } else if (date.getHour() == 12) {
        return "12" + ":" + date.getMinute() + "PM";
    } else {
        return (date.getHour()-12) + ":" + date.getMinute() + "PM";
    }
}