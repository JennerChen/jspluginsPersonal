/**
 * 绘制组件,绑定组件的事件
 */

 /*
  * @param params.container
  * @param params.properties 包含一些属性值（如：容器的宽高)
  * @param params.data 组件的信息
  * @param params.cid 组件所属的类别的ID值
  * @param params.copy TODO:测试用div-svg 用来解决拖选时出现的问题
  * @param params.API
  */
var componentManage = function(params) {
	var width = params.properties.width; //外容器的宽度
	var height = params.properties.height; //外容器的高度
	var style = DataFlowUtil.commonAPI.getPublicStyle('component');
	var padding = style.padding;
	var c_width = style.width; //组件的宽度
	var c_height = style.height; //组件的高度
	var scale = 1;
	var components = loadLibrary(params.container, params.data, params.cid);
	bindComponentEvent(components, params.copy, params.data);
	
	/*
	 * 根据数据绘制对应容器组件
	 * @param container 绘制容器的元素
	 * @param data 容器的相关数据
	 */
	function loadLibrary(container, data, cid) {
		if(!data) return;
		var nodes = [];
		for(var key in data) {
			nodes.push({
				'id': key,
				'cid': cid,
				'type': data[key].type,
				'name': data[key].name,
				'values': data[key].values
			});

		}
		computePosition(nodes);
		var eles = DataFlowUtil.drawAPI.drawComponent({
			'container': container.selectAll('.library'),
			'data': nodes,
			'prop': {scale: scale},
			'libraryData': data
		});
		return eles;
	}

	// 计算节点的位置信息
	function computePosition(nodes) {
		var level = 0; //容器的层数
		var trueWidth = (width - 4 * padding[0]) / 2;
		scale = trueWidth / c_width > 1? 1: trueWidth / c_width;
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].x = padding[0] + (trueWidth + padding[0]) * (i % 2);
			nodes[i].y = padding[1] + (c_height * scale + padding[1]) * level;
			i != 0 && ((i + 1) % 2 == 0)? level++: null;
		};
	}
	/**
	 * IE 浏览器此处有BUG！！！！！
	 */
	/*
	 * 为组件绑定事件
	 * @param seleter 需要绑定事件的元素
	 * @param container 当前的父容器
	 * @param libraryData 所有组件的数据信息
	 */
	function bindComponentEvent(selector, container, libraryData) {
		
		//当前被drag的元素
		var currentDragedComponent = null;
		//当前被drag元素的初始数据,结构[初始transform量, 初始鼠标x,初始鼠标y]
		var orginalPosition = null;
		// 被drag的clone副本,用于停止拖动时交换真实副本的
		$cloneComponent = null;
		var dragListener = d3.behavior.drag()
			.on('dragstart', function(d) {
				//设置被drag元素
				currentDragedComponent = d3.select(this);
				//设置被drag元素初始数据
				orginalPosition = [d3.select(this).attr('transform'), event.pageX, event.pageY];
				//复制drag元素,并且给予一点样式
				$cloneComponent = $(this).clone();
				$cloneComponent.attr('opacity',0.5);
				//添加复制体到当前元素的母元素中
				$(this).parent().append($cloneComponent);
			})
			.on("drag",function(d){
				if (currentDragedComponent && orginalPosition) {
					var result = _calNowTransform(orginalPosition, event.pageX, event.pageY);
					//设置被drag元素新的transform
					d3.select(this).attr('transform', 'translate(' + result[0] + ',' + result[1] + ')');
				}
			})
			.on("dragend",function(d){
				if(currentDragedComponent && orginalPosition){
					 //获取被拖拽元素属于哪个目录中,并且获得其自定义属性 category_index, e.g. 第二个目录索引是1
					 var index = parseInt($(this).parent().parent().parent().attr('category_index'));
					 //把副本添加近新的canvas中需要修改其translate属性
					 //当前情况下是被drag元素 translate x + 50, y+60+31*index, 其中31是一个目录高度+边宽度
					 var result =_calNowTransform(orginalPosition, event.pageX, event.pageY)
					 $cloneComponent.attr('transform', 'translate(' + (result[0]+50) + ',' + (result[1]+60+31*index) + ')');
					 $cloneComponent.attr('opacity',1);
					 $("#canvas").parent().append($cloneComponent);
					 //把被drag元素重置会初始位置
					 currentDragedComponent.attr('transform', orginalPosition[0]);
				}

				currentDragedComponent = null;
				orginalPosition = null;
			});
		selector.call(dragListener)
			.on('mouseover', function() {
				d3.select(this).attr('cursor', 'pointer');
			});
	}
	/**
	 * 计算当前移动距离父元素的的transform量
	 * @param  {[num]} orginalPos [被drag元素初始位置信息]
	 * @param  {[num]} nowX       [当前元素鼠标x]
	 * @param  {[num]} nowY       [当前元素鼠标y]
	 * @return {[num]}            [当前元素距离母元素的x,y数组]
	 */
	function _calNowTransform(orginalPos, nowX, nowY){
		var x = orginalPos[1];
		var y = orginalPos[2];
		//获取元素初始translate中 x,y值
		var orginalX = parseInt(orginalPos[0].substring(10, orginalPos[0].indexOf(',')));
		var orginalY = parseInt(orginalPos[0].substring(orginalPos[0].indexOf(',')+1, orginalPos[0].indexOf(')')));
		//计算当前元素应该的x,y. 该坐标是相对于被移动元素母元素的
		var newX = orginalX+(nowX-x);
		var newY = orginalY + (nowY-y);
		return [newX, newY ];
	}

};