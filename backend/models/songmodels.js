import mongoose from "mongoose";

const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

//create a model from the schema and export it. Model name is 'SongModel'

export default mongoose.model('SongModel', songSchema);