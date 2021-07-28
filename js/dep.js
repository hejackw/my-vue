class Dep{
    constructor(){
         // 存储所有的观察者
        this.sub = []
    }
     // 添加观察者
    addSub(sub){
        if(sub && sub.update){
            this.sub.push(sub)
        }
    }
  // 发送通知
    notify(){
        this.sub.forEach(sub=>{
            sub.update()
        })
    }
}