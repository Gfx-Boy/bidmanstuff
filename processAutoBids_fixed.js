async function processAutoBids() {
  try {
    console.log("🚀 Starting processAutoBids function with real-time logic");
    const usersWithAutoBidOn = await Users.find({ autoBid: true });
    console.log(`Found ${usersWithAutoBidOn.length} users with autoBid enabled`);

    for (let i = 0; i < usersWithAutoBidOn.length; i++) {
      const user = usersWithAutoBidOn[i];
      console.log(`\n👤 Processing user ${i + 1}/${usersWithAutoBidOn.length}: ${user._id}`);
      
      // Real-time calculations
      const currentTime = new Date();
      const timeLimitInMinutes = parseInt(user.timeLimit) || 30;
      const timeIntervalInMinutes = parseInt(user.timeInterval) || 2;
      
      console.log(`📊 User settings - timeLimit: ${timeLimitInMinutes} min, timeInterval: ${timeIntervalInMinutes} min`);
      
      // Ensure user has bidStartTime
      if (!user.bidStartTime) {
        console.log("⏰ Setting initial bidStartTime for user:", user._id);
        user.bidStartTime = currentTime;
        await user.save();
      }
      
      // Calculate session end time based on bidStartTime + timeLimit
      const sessionStartTime = new Date(user.bidStartTime);
      const sessionEndTime = new Date(sessionStartTime.getTime() + timeLimitInMinutes * 60000);
      
      console.log(`🕐 Session start: ${sessionStartTime.toISOString()}`);
      console.log(`🕐 Session end: ${sessionEndTime.toISOString()}`);
      console.log(`🕐 Current time: ${currentTime.toISOString()}`);
      console.log(`⏰ Session expired: ${currentTime >= sessionEndTime}`);
      
      // Check if entire bidding session has expired
      if (currentTime >= sessionEndTime) {
        console.log("⏰ Bidding session expired. Turning OFF autoBid for user:", user._id);
        await Users.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              autoBid: false,
              bidStartTime: null,
              bidEndTime: null,
              breakTime: null,
            },
          }
        );
        console.log("✅ AutoBid turned OFF due to session expiration");
        continue;
      }
      
      // Calculate which bidding cycle we're in
      const timeSinceStart = currentTime.getTime() - sessionStartTime.getTime();
      const cyclesCompleted = Math.floor(timeSinceStart / (timeIntervalInMinutes * 60000));
      const currentCycleStartTime = new Date(sessionStartTime.getTime() + cyclesCompleted * timeIntervalInMinutes * 60000);
      const currentCycleEndTime = new Date(sessionStartTime.getTime() + (cyclesCompleted + 1) * timeIntervalInMinutes * 60000);
      
      console.log(`🔄 Cycles completed: ${cyclesCompleted}`);
      console.log(`🔄 Current cycle start: ${currentCycleStartTime.toISOString()}`);
      console.log(`🔄 Current cycle end: ${currentCycleEndTime.toISOString()}`);
      console.log(`🔄 In break period: ${currentTime < currentCycleEndTime}`);
      
      // Check if we're in break period (waiting for next cycle)
      if (currentTime < currentCycleEndTime) {
        console.log("🔴 Currently in break period. Skipping bidding for user:", user._id);
        const timeUntilNextCycle = Math.floor((currentCycleEndTime.getTime() - currentTime.getTime()) / 1000);
        console.log(`⏳ Time until next bidding cycle: ${timeUntilNextCycle} seconds`);
        continue;
      }
      
      // Check if user has bids remaining
      if (user.bidsAllow <= 0) {
        console.log("❌ No bids remaining for user:", user._id);
        continue;
      }
      
      console.log("🟢 In active bidding period. Ready to process bids for user:", user._id);
      console.log(`💰 User has ${user.bidsAllow} bids remaining`);
      
      // Here would be the actual bidding logic (API calls, project filtering, etc.)
      // For now, just log that we're in the active period
      console.log("✅ User is in active bidding window - bidding logic would execute here");
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log("✅ All users processed successfully");
    return "Processing complete for all users with autoBid on";
    
  } catch (error) {
    console.error("❌ Error in processAutoBids:", error);
    throw error;
  }
}

module.exports = { processAutoBids };
