const Mongoose = require('mongoose');

const getError = require('../constants/ErrorMessages');

const counterSchema = new Mongoose.Schema({
    _id: { type: String, required: true, unique: true },
    seq: { type: Number, default: -1 }
});

function CounterModel() {
	this.nameModel = "counter";

    this.model = mongoose.model("counter", counterSchema);
}

CounterModel.prototype = {
    getIdCollection: async function(_id) {
        try {
            const result = await this.model.findOneAndUpdate({ _id }, {$inc: { seq: 1} }, {
                returnOriginal: false,
                upsert: true
            });

            if(result && result.ok) {
                return new Promise.resolve({ ok: 1, result })
            }

            throw getError(1);
        } catch(error) {
            console.log(error);

            return Promise.reject(error);
        }
    }
}

CounterModel.instance = function() {
    return new CounterModel();
}

module.exports = CounterModel.instance();