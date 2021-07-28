class Observer{
    constructor(data){
        this.walk(data)
    }
    walk(data){
          // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
        return
      }
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key])
        })
    }

    defineReactive(obj,key,val){
        //递归调用，为了把obj中的对象也变成响应式数据，例如person
        this.walk(val)
        let _this = this
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                //这里return val而不是return obj[key]，主要是调用vm.msg会堆栈溢出
                return val
            },
            set(newValue){
                if(val === newValue){
                    return
                }
                val = newValue

               // 给属性重新赋值成对象，也是是响应式的
               _this.walk(newValue)
            }
        })
    }
}