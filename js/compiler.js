class Compiler {

    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compiler(this.el)
    }
  // 编译模板，处理文本节点和元素节点
    compiler(el) {
        //children
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                  // 处理元素节点
                this.compileElement(node)
            }

              // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compiler(node)
            }
        })

    }
    parsePath(path, obj) {
        var segments = path.split('.');
        for (var i = 0; i < segments.length; i++) {
            obj = obj[segments[i]];
        }
        return obj
    }
    compileText(node) {
        let reg = /\{\{(.+?)\}\}/g
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()

            node.textContent = value.replace(reg, this.parsePath(key, this.vm))

            new Watcher(this.vm, key, (value) => {
                node.textContent = value
            })
        }
    }

     // 编译元素节点，处理指令
    compileElement(node) {
         // 遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
              // 判断是否是指令
            if (this.isDirective(attrName)) {
                 // v-text --> text
                attrName = attrName.substr(2)
                this.update(node, attrName, attr.value)
            }

        })
    }
    update(node, attrName, key) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.parsePath(key, this.vm), key)

    }

      // 处理 v-text 指令
    textUpdater(node, value, key) {
        node.textContent = value


        new Watcher(this.vm, key, (value) => {
            node.textContent = value
        })
    }

      // v-model
    modelUpdater(node, value, key) {
        node.value = value
        new Watcher(this.vm, key, (value) => {
            node.value = value
        })

         // 双向绑定
         node.addEventListener('input', ()=> {
            let newVal = node.value;
            let arr = key.split('.')
            let val = this.vm;
            console.log(key,arr)
            // 考虑到 v-model="deep.a" 这种情况
            arr.forEach((key, i)=> {
              if (i === arr.length - 1) {
                val[key] = newVal
                return
              }
              val = val[key];
             
            })
        })
    }

      // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
  // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
     // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}