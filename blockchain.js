const crypto = require("crypto") // node自带的加密库

// 创世区块
const initBlock = {
  index: 0,
  data: 'Hello block chain!',
  prevHash: '0',
  timestamp: 1593595233822,
  nonce: 89,
  hash: '008633828153a77099105c19b3ea5ce40ff98956b46c777ff5bde3a64102addb'
}

// 区块链类
class Blockchain {
  constructor() {
    this.blockchain = [initBlock]        // 区块链
    this.data = []                         // 交易数据
    this.difficulty = 2                    // 哈希计算匹配值难度
    this.nonce = 1554                      // 随机数
    this.timestemp = new Date().getTime()  // 时间戳
  }

  // 获取最新区块
  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }

  // 生成新区块
  generateBlock() {
    const index = this.blockchain.length       // 区块索引
    const prevHash = this.getLastBlock().hash  // 最后也是最新的区块值
    const data = this.data
    const timestamp = new Date().getTime()
    let nonce = 0
    let hash = this.computeHash(index, prevHash, timestamp, data, nonce)

    while (hash.slice(0, this.difficulty) !== "0".repeat(this.difficulty)) {
      nonce++
      hash = this.computeHash(index, prevHash, timestamp, data, nonce)
    }

    return {
      index,
      data,
      prevHash,
      timestamp,
      nonce,
      hash
    }
  }

  // 挖矿
  mine() {
    // 1.生成新的区块 一页新的记账加入了区块链
    // 2.不断计算哈希  直到计算出符合条件的哈希值 获取记账权
    const newBlock = this.generateBlock()
    if (this.isValidBlock(newBlock) && this.isValidChain()) {
      this.blockchain.push(newBlock)
    } else {
      console.log("Error Invaild Block", newBlock)
    }
  }

  // 返回区块的哈希值
  computeHashForBlock({ index, prevHash, timestamp, data, nonce }) {
    return this.computeHash(index, prevHash, timestamp, data, nonce)
  }

  // 计算哈希值
  computeHash(index, prevHash, timestamp, data, nonce) {
    return crypto.createHash("sha256").update(index + prevHash + timestamp + data + nonce).digest("hex")
  }

  // 校验区块
  isValidBlock(newblock, lastblock = this.getLastBlock()) {
    // 1.新建区块的index == 最后区块的index+1
    // 2.新建区块的time 大于 最后区块的time
    // 3.新建区块的prevHash == 最后区块的hash
    // 4.新建区块的哈希难度 == 符合规定的难度要求
    // 5.校验新建区块的哈希值计算正确 (校验随机数)

    if (newblock.index !== lastblock.index + 1) {
      return false
    } else if (newblock.timestamp <= lastblock.timestamp) {
      return false
    } else if (newblock.prevHash !== lastblock.hash) {
      return false
    } else if (newblock.hash.slice(0, this.difficulty) !== "0".repeat(this.difficulty)) {
      return false
    } else if (newblock.hash !== this.computeHashForBlock(newblock)) {
      return false
    }
    return true
  }

  // 校验区块链
  isValidChain(chain = this.blockchain) {

    // 校验创世区块
    if (JSON.stringify(initBlock) !== JSON.stringify(chain[0])) {
      return false
    }

    // 校验其他区块
    for (let i = chain.length - 1; i >= 1; i--) {
      if (!this.isValidBlock(chain[i], chain[i - 1])) {
        return false
      }
    }

    return true
  }

}

let bc = new Blockchain()

bc.mine()
bc.blockchain[1].prevHash = "22" // 测试修改的区块
bc.mine()
console.log("bc.blockchain", bc.blockchain)
