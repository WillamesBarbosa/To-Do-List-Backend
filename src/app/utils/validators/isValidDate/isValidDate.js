function isValidDate(dateString){
    const date_regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if(!date_regex.test(dateString)) return {isValid: false };

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const dateComparison = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    //padStart coloca o 0 antes dos números de 1 a 9
    return {isValid: dateComparison, date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2, '0')}`};
}

module.exports = isValidDate;