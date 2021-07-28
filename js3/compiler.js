class Compiler{

    constructor(vm){
    this.el = vm.$el
    this.vm = vm
    this.compiler(this.el)
    }

    compiler(el){
        //children
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node=>{
            if(this.isTextNode(node)){
                this.compileText(node)
            }else if(this.isElementNode(node)){
                this.compileElement(node)
            }

            if(node.childNodes && node.childNodes.length){
                this.compiler(node)
            }
        })
        
    }

    compileText(node){
        let reg = /\{\{(.+?)\}\}/
       let value = node.textContent
       if(reg.test(value)){
           let key = RegExp.$1.trim()

           //为什么不直接这样写
          // node.textContent =this.vm[key]
           node.textContent = value.replace(reg,this.vm[key])
       }
    }

    compileElement(node){
        console.log(node.attributes)
        Array.from(node.attributes).forEach(attr=>{
            let attrName = attr.name
            if(this.isDirective(attrName)){
                attrName = attrName.substr(2)
                this.update(node,attrName,attr.value)
            }
            
        })
    }
    update(node,attrName,value){
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this,node,this.vm[value])
    }
    textUpdater(node,value){
        node.textContent = value
    }
    modelUpdater(node,value){
        node.value = value
    }
    isDirective(attrName){
        return attrName.startsWith('v-')
    }

    isTextNode(node){
        return node.nodeType === 3
    }
    isElementNode(node){
        return node.nodeType === 1
    }
}