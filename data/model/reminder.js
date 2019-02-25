const mongoose = require('mongoose');
Schema   = mongoose.Schema;

const reminderSchema = new Schema({

    user          : {type: String},
    date          : {type: Date},
    time          : {type: String},
    reoccurance   : {type: String},
    name          : {type: String},

});

const ReminderModel = mongoose.model("ReminderModel", reminderSchema);

module.exports = ReminderModel;