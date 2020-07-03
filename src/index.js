const vorpal = require('vorpal')(); // 命令控制台
const Blockchain = require("./blockchain")
const Table = require("cli-table");  // https://www.npmjs.com/package/cli-table
let bc = new Blockchain()

// [{name:"a", age: 18}, { name:"b", age: 19 }]
function formatLog(data) {
  // 如果传进来是
  if (!Array.isArray(data)) {
    data = [data]
  }
  const first = data[0]

  const head = Object.keys(first)
  const table = new Table({
    head,
    colWidths:  new Array(head.length).fill(17)
  });

  const res = data.map(v => {
    return head.map(h => JSON.stringify(v[h], null, 1))
  })
  table.push(...res);
  console.log(table.toString());
}

vorpal
  .command("trans <from> <to> <amount>", "转账")
  .action(function(args, callback){
    let trans = bc.transfer(args.from, args.to, args.amount)
    if (trans){
      formatLog(trans)
    }
    callback()
  })

vorpal
  .command("blance <address>", "查看余额")
  .action(function(args, callback){
    let blance = bc.blance(args.address)
    this.log(blance)
    callback()
  })

vorpal
  .command('mine <address>', '挖矿')
  .action(function (args, callback) {
    let newblock = bc.mine(args.address)
    if (newblock){
      formatLog(newblock)
    }
    callback();
  });

vorpal
  .command('chain', '查看区块链')
  .action(function (args, callback) {
    formatLog(bc.blockchain)
    callback();
  });

vorpal
  .command('detail <index>', '区块详情')
  .action(function (args, callback) {
    this.log(JSON.stringify(bc.blockchain[args.index],null, 1))
    callback();
  });

console.log("欢迎来到我的区块链: mychain")
vorpal.exec("help")
vorpal.delimiter('mychain').show();