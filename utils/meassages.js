const moment = require('moment');

function formatmessage(username,text) {
return{
    username,text,time:moment().format('h:mma')
}
}

module.exports=formatmessage;