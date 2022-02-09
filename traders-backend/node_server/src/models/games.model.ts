import { Document, model, Schema } from 'mongoose';

export interface IGames extends Document {
  gameRoomID: string;
  data: string;
}

const gameSchema = new Schema({
  gameRoomID: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  trueSum: {
    type: Number,
  },
  truePnl: {
    type: Object,
  },
  penalties: {
    type: Object,
  },
});

export default model<IGames>('game', gameSchema);
