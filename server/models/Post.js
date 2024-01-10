import mongoose from "mongoose";
const CommentsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps:true }
);
export const PostSchema = new mongoose.Schema(
  {
      userId: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        max: 500,
      },
      img: {
        type: String,
      },
      likes: {
        type: Map,
        of: Boolean,
      },
      comments: {
        type: Array,
        default: [],
      },
      location:{
        type: String,
        default: "",
      }
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", PostSchema);
export const Comment = mongoose.model("Comment", CommentsSchema);

