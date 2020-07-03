// udp打洞实现p2p
const dgram = require("dgram")
const udp = dgram.createSocket("udp4")

// udp收到信息
udp.on("message", (data, remote) => {
  console.log("accpect message", data.toString())
})
udp.on("listening", function () {
  const address = udp.address()
  console.log("udp server is listening at: " + address.address + ":" + address.port)
})
udp.bind(0) // 0 - 系统随机分配端口

// udp发送消息
function send(message, port, host) {
  console.log("send message", message, port, host)
  udp.send(Buffer.from(message), port, host)
}

// node启动是获取参数
const port = process.argv[2]
const host = process.argv[3]
if (port && host) {
  send("你好啊udp", port, host)
}