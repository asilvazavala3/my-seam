//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const { getUsers } = require("./src/controllers/userControllers.js");
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const port = process.env.PORT || 3001

// Syncing all the models at once.
try {
  conn.sync({ force: false }).then(async () => {
  console.log('DB connected')
  server.listen(port, async () => {
    await getUsers();
    console.log(`%s listening at ${port}`);
  })
});
} catch (error) {
    console.error('Error occurred during server start:', error);
  }

