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

	/*
	 * 为组件绑定事件
	 * @param seleter 需要绑定事件的元素
	 * @param container 当前的父容器
	 * @param libraryData 所有组件的数据信息
	 */
	function bindComponentEvent(selector, container, libraryData) {
		console.log(selector);
		console.log(container);
		
		var curPosition = [];
		var curNodeData = null;
		var componentPosition_min = [0, 0];
		var componentPosition_max = [0, 0];
		var dragListener = d3.behavior.drag()
			.on('dragstart', function(d) {
				$(container[0]).append($(selector[0]).clone());
				curPosition[0] = d3.event.sourceEvent.pageX - d3.event.sourceEvent.offsetX;
				curPosition[1] = d3.event.sourceEvent.pageY - d3.event.sourceEvent.offsetY;
				$(container[0]).closest('#backsvg').css({
					'position': 'absolute',
					'left': curPosition[0],
					'top': curPosition[1]
				});
			})
			.on("drag",function(d){
				var left = $(container[0]).closest('#backsvg').css('left');
				var top = $(container[0]).closest('#backsvg').css('top');
				$(container[0]).closest('#backsvg').css({
					'left': parseInt(left)+ d3.event.dx,
					'top': parseInt(top)+ d3.event.dy
				});
			})
			.on("dragend",function(d){
				$(container[0]).children().remove();
				// params.container.select("#library_component_temp").remove();
				// if(curNodeData){
				// 	// TODO:将容器添加到model界面中
				// 	// params.Api.addComponentToCanvas(newComoponentData);
				// }
				// curNodeData = null;
			});
		selector.call(dragListener)
			.on('mouseover', function() {
				d3.select(this).attr('cursor', 'pointer');
			});
	}
};