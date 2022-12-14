const multiparty = require("multiparty");
const promisifyUpload = (req) => new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) return reject(err);

        return resolve([fields, files]);
    });
});