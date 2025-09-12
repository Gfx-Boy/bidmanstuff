const mongoose = require('mongoose');
const Users = require('./models/Users');

mongoose.connect('mongodb://localhost:27017/checkbid');

async function resetUser() {
  try {
    const result = await Users.findOneAndUpdate(
      { _id: '6898ba557d28d2eeb937c24b' },
      {
        $set: {
          autoBid: true,
          timeLimit: 30,        // 30-minute session
          timeInterval: 2,      // 2 minutes between bids
          bidsLimit: 5,         // Allow 5 bids
          bidStartTime: null,   // Will be set automatically
          bidEndTime: null,     // Will be calculated
          breakTime: null       // Will be managed automatically
        }
      },
      { new: true }
    );
    console.log('User updated successfully!');
    console.log('autoBid:', result.autoBid);
    console.log('timeLimit:', result.timeLimit);
    console.log('timeInterval:', result.timeInterval);
    console.log('bidsLimit:', result.bidsLimit);
    console.log('bidStartTime:', result.bidStartTime);
    console.log('bidEndTime:', result.bidEndTime);
    console.log('breakTime:', result.breakTime);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetUser();
