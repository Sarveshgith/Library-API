function DateDifference(date1, date2){

    const dateM1 = new Date(date1).getTime();
    const dateM2 = new Date(date2).getTime();

    const diffM = Math.abs(dateM2 - dateM1);

    const diffday = Math.ceil(diffM / (1000 * 60 * 60 * 24));

    return diffday;
};

// const date1 = "2024-06-01";
// const date2 = "2024-06-10";

// const daysDifference = DateDifference(date1, date2);
// console.log(`The difference between ${date1} and ${date2} is ${daysDifference} days.`);

module.exports = {DateDifference};

