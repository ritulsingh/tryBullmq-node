const loadtest = require('loadtest');
const options = {
    url: 'http://127.0.0.1:5000/send',
    maxRequests: 1000,
    method: 'POST',
    contentType: 'application/json',
    body: {
        "type": "color",
        "message": "Hello Ritul"
    }
};
loadtest.loadTest(options, function (error, result) {
    if (error) {
        return console.error('Got an error: %s', error);
    }else{
        console.log(result);
    }
    console.log('Tests run successfully');
});