// rsa非对称加密
// 公钥（所有人知道，用来解密）
// 私钥（每个人独有的私钥，加密传输信息）

// 1.生成公私钥对
// 2.公钥充当地址使用（或者截取公钥）
const fs = require("fs");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keypair = ec.genKeyPair();


// 1. 持久化公私密钥对
function generateKeys() {
  const fileName = "./wallet.json"
  try {
    let res = JSON.parse(fs.readFileSync(fileName))
    if (res.prv && res.pub && getPub(res.prv) == res.pub) {
      let keypair = ec.keyFromPrivate(res.prv);
      return res
    } else {
      // 对不起 验证失败 重新生成
      throw "not valid wallet.json"
    }
  } catch (error) {
    console.log("generate -> error", error)
    // wallet.json文件不合法 或者文件内容不合法 重新生成  
    const res = {
      prv: keypair.getPrivate("hex").toString(),
      pub: keypair.getPublic("hex").toString()
    }
    fs.writeFileSync(fileName, JSON.stringify(res))
    return res
  }
}

function getPub(prv) {
  // 根据私钥算出公钥
  return ec.keyFromPrivate(prv).getPublic("hex").toString()
}

// 2. 签名
function sign({ from, to, amount }) {
  const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
  let signature = Buffer.from(keypair.sign(bufferMsg).toDER().toString("hex"))
  return signature
}


// 3. 校验签名 
function verify({ from, to, amount, signature}, pub){
  // 校验是没有私钥的
  const bufferMsg = Buffer.from(`${from}-${to}-${amount}`)
  const keypairTemp = ec.keyFromPublic(pub,"hex")
  
  return keypairTemp.verify(bufferMsg, signature)
}
console.log(generateKeys())