const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ElectionSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        voters: {
            type: [String],
        },
        winner: {
            type: String,
        },
        contractAddress: {
            type: String,
            required: true
        },
        winnerTotalVotes: {
            type: Number
        }
    },
    {timestamps: true}
);

export default mongoose.models.Election || mongoose.model("Election", ElectionSchema);
