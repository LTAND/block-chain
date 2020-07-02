const vorpal = require('vorpal')(); // 命令控制台

vorpal
  .command('hello', '你好')
  .action(function (args, callback) {
    this.log('你好，区块链');
    callback();
  });
vorpal
  .command('asd', '你好')
  .action(function (args, callback) {
    this.log('你好，区块链');
    callback();
  });


console.log("欢迎来到我的区块链 mychain") 
vorpal.exec("help")
vorpal
  .delimiter('mychain')
  .show();