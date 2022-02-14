const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ElectionSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        participants: {
            type: [String],
        },
        voters: {
            type: [String],
        },
        winner: {
            type: String,
        },
        totalVotes: {
            type: Number
        }
    },
    {timestamps: true}
);

export default mongoose.models.Election || mongoose.model("Election", ElectionSchema);
