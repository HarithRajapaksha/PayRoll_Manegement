const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: String,required:true },
  name: { type: String,required:true },   
  date: { type: Date, default: Date.now },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
  status: { type: String ,default: function() {
    const currentTime = new Date();
    const hour = currentTime.getHours(); 
    
    return hour > 9 ? "HalfDay" : "Present";},
}},{timestamps:true} );


const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;
