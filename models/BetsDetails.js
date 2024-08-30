import { model, Schema } from "mongoose";
const BetsDetails = new Schema(
  {
    matchId: { type: String, index: true },
    exposure: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "user", index: true },
    bettingData: [
      {
        dateTime: { type: Date, index: true, default: Date.now },
        team: { type: String, index: true },
        amount: { type: Number, index: true },
        teamA_amount: { type: Number },
        teamB_amount: { type: Number },
        betType: { type: String, index: true },
        betValue: { type: Number, index: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("bets_detail", BetsDetails);
