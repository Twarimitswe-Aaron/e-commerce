import User from "../model/user.js";
import cron from "node-cron";

const cleanUpInactiveUsers = async () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await User.deleteMany({
        isActive: false,
        activationTokenExpire: {
          $lt: Date.now(),
        },
      });
      console.log(`Deleted ${result.deletedCount} inactive users`);
    } catch (err) {
      console.log(err);
    }
  });
};

export default cleanUpInactiveUsers;
