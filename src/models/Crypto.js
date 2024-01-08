const mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'],
        required: [true, 'Payment method is required']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyers: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});

cryptoSchema.plugin(mongooseLeanVirtuals);

cryptoSchema.statics.getStringFields = function () {
    return Object.entries(this.schema.paths)
        .filter(([fieldName, field]) => field.instance === 'String')
        .map(([fieldName]) => fieldName);
};

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
