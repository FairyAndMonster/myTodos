; (function () {

	//让 input 一上来就聚焦一次
	Vue.directive('focus',{
		inserted: function (el) {
			el.focus();
		}
	})

	Vue.directive('todo-focus',{
		update (el,binding) {
			console.log(binding.value);
			if(binding.value) {
				el.focus();
			}
		}
	})



	const todos = [
		{
			id: 1,
			title: '吃饭',
			completed: true
		},
		{
			id: 2,
			title: '睡觉',
			completed: true
		},
		{
			id: 3,
			title: '打豆豆',
			completed: false
		}

	]
	window.app = new Vue({
		// el: '#app',

		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),

			currentEditing: null,
			filterText: 'all'

		},
		computed: {
			// 计算属性是一个方法，但是必须当做属性来用，不能调用
			showUncompleted: {
				// 调用 showUncompleted 会自动访问 get 方法
				get() {
					return this.todos.filter(item => !item.completed).length;
				},
				// 当给 toggleAll 赋值的时候调用 set 方法
				// set() {
				// 	console.log("hello")
				// }
			},
			toggleAll: {
				get() {
					//计算属性知道了它依赖 todos
					//当 todos 发生变化，计算属性会重新计算
					//every 方法：每个元素都为 true 返回 true => &&
					//some 方法： 只要 一个元素为 true 返回true => ||
					return this.todos.every(item => item.completed);
				},
				set() {
					//表单控件 checkbox 双向 绑定了 toggleAll
					// checxbox 的变化会调用 set 方法
					// 在set中： 1，得到当前的 checkbox 状态 2，把所有任务都选中为 toggleAll 的选中 状态
					const checked = !this.toggleAll;
					this.todos.forEach(item => {
						item.completed = checked;
					})
				}
			},
			filterTodos() {
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(item => !item.completed)
						break


					case 'completed':
						return this.todos.filter(item => item.completed)
						break


					default:
						return this.todos
						break
				}
			}

		},
		watch: {
			//监视 todos 的改变
			//引用类型只能监视一层，，无法监视内部成员的子成员的改变
			todos: {
				// 当监视到 todos 改变的时候会自动调用 handler 方法
				// 你监视谁，val就是谁； 
				// val 是变化之后的值；oldVal是变化之前的值
				handler(val, oldVal) {
					window.localStorage.setItem("todos", JSON.stringify(val));
				},
				deep: true,   //深度监视，能监视到 数组或对象的内部成员
			}
		},
		methods: {
			// 添加选项
			handleNewTodoKeydown(e) {
				// console.log(11)
				const target = e.target;
				// console.log(target);
				const value = target.value;
				// console.log(value)
				// 不能为空
				if (!value.length) {
					return
				}
				const todos = this.todos;
				// console.log(this)
				// console.log(todos)
				todos.push({
					id: todos.length ? todos[todos.length - 1].id + 1 : 1,
					title: value,
					completed: false
				})
				//清空输入框
				target.value = ''


			},

			//全选和全不选
			handleToggleClick(e) {
				// console.log(e);
				// console.log(1)
				//1 绑定 checkbox 的 click 事件
				//2 获取 checkbox 的选中状态
				//3 循环子任务中的选中状态和 checkbox 一致
				const checked = e.target.checked;
				// console.log(checked);   //true  false
				const todos = this.todos;
				todos.forEach(item => {
					item.completed = checked;
				})
			},

			//删除选项
			handleRemoveClick(index, e) {
				// console.log(index);
				// console.log(1)
				this.todos.splice(index, 1);
			},

			// 双击lbel进入编辑模式
			handleDblclickEditing(item) {
				// console.log(1)
				// console.log(item)
				this.currentEditing = item;
			},
			//编辑任务，回车保存编辑
			handleSaveEdit(item, index, e) {
				// console.log(1)
				// 1 获取文本框的内容
				// 2 数据校验：如果数据为空直接删除；否则保存
				const target = e.target;
				const value = target.value.trim();
				if (!value.length) {
					this.todos.splice(index, 1);
				} else {
					item.title = value; //保存任务
					this.currentEditing = null; //去除编辑的样式
				}

			},
			// 按esc取消编辑
			handleEscCancle(item, index, e) {
				// console.log(1)
				this.currentEditing = null;

			},
			// 清除所有已选中的任务
			handleClearAll() {
				// 	// console.log(1)
				// 	for(var i=0;i<this.todos.length;i++) {
				// 		if(this.todos[i].completed) {
				// 			this.todos.splice(i,1);
				// 			i--;
				// 		}
				// 	}
				// 把需要的结果过滤出来重新赋值到列表中
				this.todos = this.todos.filter(t => !t.completed)
			}



		},

	}).$mount("#app")

	handleHashChange();

	window.onhashchange = handleHashChange;
	//注册锚点的改变事件
	function handleHashChange() {
		// console.log(window.location.hash)
		app.filterText = window.location.hash.substr(2);
	}
})();
