import Startup from "./startup";

(async () => {
  try {
    await Startup();
  } catch (err) {
    console.log(err);
  }
})();
