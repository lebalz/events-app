const getLastMonday = (date: Date = new Date()) => {
    const dateCopy = new Date(date.getTime());
    dateCopy.setUTCHours(0, 0, 0, 0);
    const nextMonday = new Date(
        dateCopy.setUTCDate(dateCopy.getUTCDate() - dateCopy.getUTCDay() + 1),
    );

    return nextMonday;
}

export {getLastMonday}