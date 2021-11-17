export default class SocketService {
  static instance = null;
  //创建单例模式SocketService
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }
  ws = null
  //用于存储回调函数
  callBackMap = {}
  //是否成功连接
  isConnect = false
  //重新发送次数
  connectNum = 0
  // 重新连接尝试的次数
  connectCount = 0
  connect() {
    if (!window.WebSocket) {
      return '您的服务器暂时不支持socket连接'
    }
    this.ws = new WebSocket('ws://localhost:9999');
    this.ws.onopen = () => {
      console.log('连接服务器成功～')
      this.isConnect = true;
    }
    this.ws.onclose = () => {
      console.log('连接服务器失败～')
      this.isConnect = false
      this.connectCount++
      setTimeout(() => {
        this.connect()
      }, this.connectCount * 500);
    }
    this.ws.onmessage = (msg) => {
      const result = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
      const sockType = result.sockType;
      if (this.callBackMap[sockType]) {
        if (result.action === 'getData') {
          const resData = JSON.parse(result.data);
          this.callBackMap[sockType].call(this, resData);
        } else if (result.action === 'fullScreen') {
          this.callBackMap[sockType].call(this, result);
        } else if (result.action === 'themeChange') {

        }
      }
    }
  }
  registerCallBack(sockType, callBack) {
    this.callBackMap[sockType] = callBack;
  }
  unRegister(sockType) {
    this.callBackMap[sockType] = null
  }
  send(data) {
    if (this.isConnect) {
      this.ws.send(JSON.stringify(data));
      this.connectNum = 0
    } else {
      this.connectNum++;
      setTimeout(() => {
        this.send(data)
      }, this.connectNum * 500);
    }
  }

}