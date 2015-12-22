/**
 * SVG Accordion Style
 * @param {d3 element} svgAccordion         [需要添加手风琴的容器, 必须以d3元素]
 * @param {[data]} dataList 			[数据集合]
 * @param {num} totalWidth           [手风琴的宽度]
 * @param {num} totalHeight          [手风琴高度]
 * @param {num} containerWidth       [手风琴中每一个目录的宽度]
 * @param {num} containerHeight      [手风琴中每一个目录的高度]
 * @param {num} containerStrokeWidth [手风琴中每一个目录的边框宽度]
 */
function SvgAccordion( svgAccordion, dataList, totalWidth, totalHeight, containerWidth, containerHeight, containerStrokeWidth){
	
	this.totalWidth = totalWidth;
	this.totalHeight = totalHeight;
	this.containerWidth = containerWidth;
	this.containerHeight = containerHeight;
	this.containerStrokeWidth = containerStrokeWidth;
	this.svgAccordion = svgAccordion;
	//dataList 结构 [{
	//					"displayName": "A",
	//					"data": data
	//				}]
	this.dataList = dataList;
	var svg = svgAccordion.append('g')
		.attr('transform', 'translate(' + 10 + ',' + 10 + ')')
		.attr('width', totalWidth)
		.attr('height', totalHeight)
		.style({
			'fill': 'none',
			//'stroke': "#9117FF",
			'stroke-width': 2,
		});



	//初始化容器
	var containersList = initContainers();


	/**
	 * 绑定事件到container中
	 * @param  {d3 element} container [component元素的容器]
	 * 
	 */
	function bandClickEventToContainer(container) {
		if (container) {
			container.select('text').on('click', _containerClickEvent);
			// $("rect:first",$(this).parent()).trigger("click");
			container.select('rect').on('click', _containerClickEvent);
		};
	};

	function _containerClickEvent() {
		//重置容器
		reSize();
		//获取当前触发容器 id
		var componentName = $(this).parent().attr('id');
		//获取当前触发容器对应数据index
		var category_index = parseInt($(this).parent().attr('category_index'));
		//获取当前触发容器中Title元素 y 坐标, 并且计算出显示容器内容的 y 坐标 (31 = 30是容器标题高度, 1为边宽度)
		//var yHight = parseInt($("rect:first", $(this).parent()).attr('y')) + 31;
		var yHight = parseInt($("rect:first", $(this).parent()).attr('y')) + containerHeight+ containerStrokeWidth;
		//设定外围容器 outer
		var outer = d3.select('#' + componentName)
									.append('g')
									//显示容器内容的id, 依据此id来销魂当前元素
									.attr('id', '_accordion_current_components');

		var content = outer
			.append('rect')
			.attr('x', 10)
			//设置显示容器内容的y 坐标
			.attr('y', yHight)
			.attr('width', containerWidth)
			.attr('height', 0)
			.attr('rx', 1)
			.attr('ry', 1)
			//显示容器内容的id, 依据此id来销魂当前元素
			.attr('id', '_accordion_current_components')
			.style({
				'fill': '#F3EDED',
				'opacity': 0.5,
				"stroke": "#FB8BBF"
			});
		//生成组件UI 核心代码
		//创建一个组件容器 componentList
		var componentList =outer
						.append('g')
						//修改偏移量
						.attr('transform', 'translate(' + 40 + ',' + (50+category_index*(containerHeight+ containerStrokeWidth)) + ')')
						//默认不显示该组件UI
						.style({"opacity":0});
		//组件的一些数据，参数 		  
		componentManage({
			container: componentList,
			properties: {width: 300, height: 200},
			//根据当前选中容器的category_index 获取数据
			data: dataList[category_index].data, 
			cid: 61
		});
		//生成组件
		DataFlowUtil.drawAPI.addRendering(componentList);
		//计算 内容的高度  = (dataList[category_index]的长度 除以2 +1)*80px + 固定宽度 50
		var contentHeight = (_.reduce(dataList[category_index].data, function(memo) {
			memo++;
			return memo;
		}, 0) / 2 + 1) * 80+50;

		//是否要重新修改当前迭代容器的size
		var reSizeComponentContainer = false;
		//containersList必须为有序的, i.e. 按照顺序从上到下排列
		// 查找当前触发事件的容器，如果查找到 那么接下来数组中所有容器要修改size
		$.each(containersList, function(index, val) {
			//查找当前触发事件的容器
			if (componentName == val.attr('id')) {

				reSizeComponentContainer = true;
				return;
			}

			if (reSizeComponentContainer) {
				//*****如果需要移动的元素过多，可以考虑移动整个g元素*******
				//需要修改的容器y 坐标 修改为 (500+ 10 +(30+3)*index)
				//500 是 显示容器内容(current_components)的高度
				//10 是当前容器数组中Title元素的初始 y
				//(30+1) 30 为 每一个容器标题的高度 , 1为 边宽度
				//d3.select('#' + val.attr('id')).select('rect').tra
				//nsition().duration(1000).attr('y', (500 + 10 + (30 + 1) * index));
				//修改text坐标
				//32为当前text的y
				//d3.select('#' + val.attr('id')).select('text').transition().duration(1000).attr('y', (500 + 32 + (30 + 1) * index));
				d3.select('#' + val.attr('id')).select('rect').transition().duration(500).attr('y', (contentHeight + 10 + (containerHeight + containerStrokeWidth) * index));
				d3.select('#' + val.attr('id')).select('text').transition().duration(500).attr('y', (contentHeight + 32 + (containerHeight + containerStrokeWidth) * index));
			};
		});
		//var contentHeight = (dataList[category_index].length/2 +1)*100;
		//边框设定展示的动画		    
		content.transition()
			.duration(1000)
			.ease("linear")
			.delay(500)
			//显示容器内容的高度
			.attr("height", contentHeight);

		//核心组件UI 展示动画
		componentList.transition()
					 .duration(1000)
					 .ease("linear")
					 .delay(500)
					 .style({"opacity":1});

	};
	/**
	 * 重置components 容器到初始状态
	 */
	function reSize() {
		//销毁当前显示的components组件集合
		if ($('#_accordion_current_components')) {
			$('#_accordion_current_components').remove();
		}
		//*****如果需要重置的元素过多，可以考虑重置整个g元素*******
		//重置每一个元素至初始状态
		$.each(containersList, function(index, val) {
			val.select('rect').attr('y', 10 + index * (containerHeight + containerStrokeWidth));
			val.select('text').attr('y', 32 + index * (containerHeight + containerStrokeWidth));
		});

	};

	/**
	 * 初始化component容器
	 * 获取所有容器的集合(以d3 element为元素返回)
	 * @return {[d3 element]} [当前所有容器的集合]
	 */
	function initContainers() {
		// var result = [];
		// $.each(dataList, function(index, val) {
		// 	 var containerNew =  svg.append('g')
		// 	 						//根据此id销毁当前显示的view
		// 							.attr('id', '_accordion_component'+index)
		// 							//根据此index来绑定对应的数据
		// 							.attr('category_index', index);

		// 		containerNew.append('rect')
		// 			.attr('x', 10)
		// 			.attr('y', 10+(containerHeight + containerStrokeWidth)* index)
		// 			.attr('width', containerWidth)
		// 			.attr('height', containerHeight)
		// 			.attr('rx', 3)
		// 			.attr('ry', 3)
		// 			.style({
		// 				'fill': '#F68A8A',
		// 				'stroke': "#D2FC0A",
		// 				// 'stroke-width': 1,
		// 			});

		// 		containerNew.append('text')
		// 			.attr({
		// 				"x": '15',
		// 				"y": 32+(containerHeight + containerStrokeWidth)* index,
		// 				"font-family": "Verdana",
		// 				"font-size": "20",
		// 				'stroke': "#9117FF",
		// 			})
		// 			.text(val.displayName);
		// 		result.push(containerNew);
		// });
		//创建components容器,  A B C
		//A
		var componentsContainerA = svg.append('g')
			.attr('id', '_accordion_componentA')
			.attr('category_index', 0);
		componentsContainerA.append('rect')
			.attr('x', 10)
			.attr('y', 10)
			.attr('width', containerWidth)
			.attr('height', containerHeight)
			.attr('rx', 3)
			.attr('ry', 3)
			.style({
				'fill': '#F68A8A',
				'stroke': "#D2FC0A",
				// 'stroke-width': 1,
			});

		componentsContainerA.append('text')
			.attr({
				"x": '15',
				"y": '32',
				"font-family": "Verdana",
				"font-size": "20",
				'stroke': "#9117FF",
			})
			.text("ContainerA");
		//B
		var componentsContainerB = svg.append('g')
			.attr('id', '_accordion_componentB')
			.attr('category_index', 1);
		componentsContainerB.append('rect')
			.attr('x', 10)
			.attr('y', (10 + containerHeight + containerStrokeWidth))
			.attr('width', containerWidth)
			.attr('height', containerHeight)
			.attr('rx', 3)
			.attr('ry', 3)
			.style({
				'fill': '#A273FC',
				'stroke': "#FB66CF",
				// 'stroke-width': 1,
			});
		componentsContainerB.append('text')
			.attr({
				"x": '15',
				"y": 32 + 31,
				"font-family": "Verdana",
				"font-size": "20",
				'stroke': "#FC6AF5",
			})
			.text("ContainerB");

		//C
		var componentsContainerC = svg.append('g')
			.attr('id', '_accordion_componentC')
			.attr('category_index', 2);

		componentsContainerC.append('rect')
			.attr('x', 10)
			.attr('y', (10 + 30 + 1 + 30 + 1))
			.attr('width', containerWidth)
			.attr('height', containerHeight)
			.attr('rx', 3)
			.attr('ry', 3)
			.style({
				'fill': '#96F7F0',
				'stroke': "#EB7CFF",
				// 'stroke-width': 1,
			});

		componentsContainerC.append('text')
			.attr({
				"x": '15',
				"y": 32 + 31 + 31,
				"font-family": "Verdana",
				"font-size": "20",
				'stroke': "#D28AF9",
			})
			.text("ContainerC");

		//绑定点击事件到每一个container中
		$.each([componentsContainerA,componentsContainerB,componentsContainerC], function(index, val) {
			bandClickEventToContainer(val);
		});
		//必须为有序数组				    
		return [componentsContainerA,componentsContainerB,componentsContainerC];
	};

} 
