exports.formatDate = (d) => {
        var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

exports.sqlToDate = (date) => {
    return date.split('T')[0];
};

exports.jsDate = (date) => {
    var dateParts = date.split("-");
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
}