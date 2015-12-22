/**
 * SVG Accordion Style
 * 
 * 必要前置工具js: jquery 1.11.3, d3.js, underscore.js 
 * 随带样式css: svgaccordion.css
 * 
 * @author [Qing]
 * @param {d3 element} svgAccordion         [需要添加手风琴的容器, 必须以d3元素]
 * @param {[data]} dataList 			[数据集合]
 * @param {num} totalWidth           [手风琴的宽度]
 * @param {num} totalHeight          [手风琴高度]
 * @param {num} containerWidth       [手风琴中每一个目录的宽度]
 * @param {num} containerHeight      [手风琴中每一个目录的高度]
 * @param {num} containerStrokeWidth [手风琴中每一个目录的边框宽度]
 */
function SvgAccordion( svgAccordion, dataList, totalWidth, totalHeight, containerWidth, containerHeight, containerStrokeWidth){

	//初始化参数 如无输入则赋予必要值 
	//[mandatory] 
	svgAccordion = svgAccordion;
	//[mandatory] 
	//dataList 结构 [{
	//					"displayName": "A",
	//					"data": data
	//				}]
	dataList = dataList;
	//参数设置必须合理，否则不正确显示
	//[option] default 310
	totalWidth = totalWidth? totalWidth:310;
	//[option] default 750
	totalHeight = totalHeight? totalHeight:750;
	//[option] default 300
	containerWidth = containerWidth? containerWidth:300;
	//[option] default 30
	containerHeight = containerHeight? containerHeight: 30;
	//[option] default 1
	containerStrokeWidth = containerStrokeWidth? containerStrokeWidth:1;

	//初始化容器,当new 一个当前对象是自动调用
	var containersList = initContainers();

	/**
	 * 绑定事件到container中
	 * @param  {d3 element} container [component元素的容器]
	 * 
	 */
	function _bandClickEventToContainer(container) {
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
		//获取当前触发容器中Title元素 y 坐标, 并且计算出显示容器内容的 y 坐标 (e.g. 31 = 30是容器标题高度, 1为边宽度)
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
				'fill': '#FFFFFF',
				'opacity': 0.5,
				"stroke": "#E3E3E3"
			});

		var contentHeight = 500;
		////////////////////////////////////////
		///自定义部分(替换该部分为你的UI组件)///
		////////////////////////////////////////
		// //生成组件UI 核心代码
		// //创建一个组件容器 componentList
		// var componentList =outer
		// 				.append('g')
		// 				//修改偏移量
		// 				//x: (容器宽度-220)/2, e.g. 当容器宽300时,x为40
		// 				//y: (50+ 当前目录index*目录标题高度), e.g. 目录索引index是1时(手风琴第二个元素),目录高度31时, 值为 50+ 1*(31);
		// 				.attr('transform', 'translate(' + ((containerWidth- 220)/2) + ',' + (50+category_index*(containerHeight+ containerStrokeWidth)) + ')')
		// 				//默认不显示该组件UI
		// 				.style({"opacity":0});
		// //组件的一些数据，参数 		  
		// componentManage({
		// 	container: componentList,
		// 	properties: {width: 300, height: 200},
		// 	//根据当前选中容器的category_index 获取数据
		// 	data: !dataList[category_index].data, 
		// 	cid: 61
		// });
		// //生成组件
		// DataFlowUtil.drawAPI.addRendering(componentList);
		// //计算 内容的高度  = (!dataList[category_index]的长度 除以2 +1)*80px + 固定宽度 50
		// var contentHeight = (_.reduce(!dataList[category_index].data, function(memo) {
		// 	memo++;
		// 	return memo;
		// }, 0) / 2 + 1) * 80+50;

		//是否要重新修改当前迭代容器的size
		var reSizeComponentContainer = false;
		//containersList必须为有序的, i.e. 按照顺序从上到下排列
		// 查找当前触发事件的容器，如果查找到 那么接下来数组中所有容器要修改size
		$.each(containersList, function(index, val) {
			//查找当前触发事件的容器
			if (componentName == val.attr('id')) {
				reSizeComponentContainer = true;
				return;
			};

			if (reSizeComponentContainer) {
				//*****如果需要移动的元素过多，可以考虑移动整个g元素*******
				//需要修改的容器y 坐标 修改为 (A+ 10 +(B+C)*index)
				//A 是 显示容器内容(current_components)的高度
				//10 是当前容器数组中Title元素的初始 y
				//(B+C) B 为 每一个容器标题的高度 , C为 边宽度
				//index 为当前点击的索引
				//修改text坐标
				//32为当前text元素的初始y
				d3.select('#' + val.attr('id')).select('rect').transition().duration(1250).attr('y', (contentHeight + 10 + (containerHeight + containerStrokeWidth) * index));
				d3.select('#' + val.attr('id')).select('text').transition().duration(1250).attr('y', (contentHeight + 32 + (containerHeight + containerStrokeWidth) * index));
			};
		});
		//背景边框设定展示的动画		    
		content.transition()
			.duration(850)
			.ease("linear")
			.delay(100)
			//显示容器内容的高度
			.attr("height", contentHeight);
		///////////////////////////////////////
		///自定义UI动画						///
		///////////////////////////////////////
		// //核心组件UI 展示动画
		// componentList.transition()
		// 			 .duration(1000)
		// 			 .ease("linear")
		// 			 .delay(700)
		// 			 .style({"opacity":1});

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
	 * @return {[d3 element]} [当前所有容器的集合, 有序 从上到下的]
	 */
	function initContainers() {
		//相当于创建一个总的容器
		var svg = svgAccordion.append('g')
			.attr('transform', 'translate(' + 10 + ',' + 10 + ')')
			.attr('width', totalWidth)
			.attr('height', totalHeight)
			.style({
				'fill': 'none',
				//'stroke': "#9117FF",
				'stroke-width': 2,
			});
		//返回一个当前手风琴中从上至下的有序container目录
		var result = [];
		//应用时应注释该判断
		if(!dataList){
			dataList = [{
				"displayName":"A"
			},{
				"displayName":"B"
			},{
				"displayName":"C"
			}]
		};
		$.each(dataList, function(index, val) {
			 var containerNew =  svg.append('g')
			 						//根据此id销毁当前显示的view
									.attr('id', '_accordion_component'+index)
									//根据此index来绑定对应的数据
									.attr('category_index', index);

				containerNew.append('rect')
					.attr('x', 10)
					//计算容器标题框的y坐标
					.attr('y', 10+(containerHeight + containerStrokeWidth)* index)
					.attr('width', containerWidth)
					.attr('height', containerHeight)
					.attr('rx', 3)
					.attr('ry', 3)
					.style({
						'fill': '#F5F5F5',
						'stroke': "#E3E3E3",
					});

				containerNew.append('text')
					.attr({
						"x": '15',
						//计算容器标题框文字的y坐标
						"y": 32+(containerHeight + containerStrokeWidth)* index,
						"font-family": "Verdana",
						"font-size": "20",
						'stroke': "#5C5B5D",
					})
					//title的名字
					.text(val.displayName);
				result.push(containerNew);
		});
		//绑定点击事件到每一个container中
		$.each(result, function(index, val) {
			_bandClickEventToContainer(val);
		});			    
		return result;
	};

} 

