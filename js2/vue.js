class Vue{

    constructor(options){
        this.$opthions = options
        this.$data = options.data
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el):options.el

        // 把data中的成员转换成getter和setter，注入到vue实例中
        this._proxyData(this.$data)


        //把data中的数据变成响应式的
        new Observer(this.$data)
    }

    _proxyData(data){
        Object.keys(data).forEach(key =>{
            Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(data[key]===newValue){
                        return
                    }
                    data[key] = newValue
                }
            })
        })
    }
}