class Watcher{
    constructor(vm,key,cb){
        this.vm = vm
        this.key = key
        this.cb = cb

        Dep.target = this

        //触发get，调用dep.addSub
        this.oldValue =  this.parsePath(this.key,this.vm) 

        //添加后清空，防止重复添加
        Dep.target = null
    }
    parsePath (path,obj) {
        var segments = path.split('.');
          for (var i = 0; i < segments.length; i++) {
            obj = obj[segments[i]];
          }
        return obj
      }
    update(){
        let newValue = this.parsePath(this.key,this.vm) 
        if(newValue === this.oldValue){
            return
        }
        this.cb(newValue)
    }
}


//Watcher跟踪的是模板，而dep跟踪的data数据，每一个data数据都会对应一个dep的实例，但每一个data数据可能
//会在模板多次引用，所以会有多个watcher,所以一个dep可以对应多个wather