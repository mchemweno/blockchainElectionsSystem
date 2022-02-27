const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ElectionSchema = new Schema(
    {
        voters: {
            type: [{
                email: {
                    type: String,
                    required: true,
                    unique: false
                },
                address: {
                    type: String,
                    required: true,
                    unique: false

                }
            }],
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
        },
        aspirants: {
            type: [{
                email: {
                    type: String,
                    required: true,
                    unique: false
                },
                votes: {
                    type: Number,
                    required: true,
                    unique: false,
                    default: 0

                }
            }],
        },
        year: {
            type: Number
        },
        post: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);

export default mongoose.models.Election || mongoose.model("Election", ElectionSchema);
