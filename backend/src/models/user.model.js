import mongoose from "mongoose";
import { Temporal } from "temporal-polyfill";

const userSchema = mongoose.Schema({
    NameStudent: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    DateCreated: {
        type: String,
        default: () => Temporal.Now.instant().toString()
    }
})
export default mongoose.model('User', userSchema);