import mongoose from 'mongoose';

const connectDb = () => {
    mongoose.connect(process.env.DB).then(()=>{
        console.log("Connected to DB");
    }).catch((err)=>{
        console.log(err);
    })
};
export default connectDb;