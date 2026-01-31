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
    }
}, { timestamps: true });

//create a model from the schema and export it. Model name is 'Song'

export default mongoose.model('SongModel', songSchema);