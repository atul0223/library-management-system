import mongoose, { Schema } from "mongoose";
export interface Ibook extends Document {
  title: string;
  author: string;
  ISBN: string;
  available: boolean;
}
const bookSchema = new Schema( {
  title: String,
  author: String,
  ISBN: {type:Number,
required:true,
unique:true
  },
  available: Boolean
},{
    timestamps:true
})
const Book =mongoose.model<Ibook>("Book",bookSchema)
export default Book