let fs = require('fs');
const format = require('node.date-time');

function logTime(){
    return new Date().format("y-M-d H:M:S") + '';
}

setInterval(function () {
    fs.appendFile('readme.log', logTime() +'time of logging'+'\n');
},3000);

