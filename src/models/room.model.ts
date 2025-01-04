import { Document, model, Model, Schema } from "mongoose";

interface IRoom extends Document {
  roomNumber: string;
  roomCode: string;
  roomTypeRef: Schema.Types.ObjectId;
  propertyRef: Schema.Types.ObjectId;
  isAvailable: boolean;
  floor?: number;
}

type RoomModel = Model<IRoom, {}>;

const RoomSchema = new Schema<IRoom, RoomModel>(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomCode: {
      type: String,
      unique: true,
      trim: true,
    },
    roomTypeRef: {
      type: Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    propertyRef: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    floor: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Room = model<IRoom, RoomModel>("Room", RoomSchema);

export default Room;
