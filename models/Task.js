const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3
	},
	userId:  {
		type: String,
		required: true
    },
    isClosed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;