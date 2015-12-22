/**
 * 放置与dataflow相关的一些工具方法和常量
 * 15.7.20 初改完成
 */
// 从数据库中获取的值
var SystemValues = {
		Models: [], // 模型的相关数据
		Fields: [], // 未知
		Rules: {}, // 容器间的连接关系
		LibraryComponents: {} // 容器的相关数据
	};
	
var DataFlowUtil = function() {
	// 一些dataflow组件的常量值
	var stroke_width = 1;
	var publicStyle = {
		'stroke_width': stroke_width,
		"model_style": { //模型各部分的样式
			"padding": [10, 100],
			"node": { // 组件属性
				"class": "node"
			},
			"interface": { // 实际为一个个小矩形
				"height": 5, // 接口高度
				"width": 5, //接口宽度
				"padding": 6, // 接口间距
				"class": "interface", 
				"stroke": "slategrey", // 接口边框颜色
				"stroke_width": 0, // 边框宽度
				"fill": "navy", //填充色
				"opacity": 1 // 透明度
			},
			"loop": { //接口的感应区域(圆形)
				"stroke": "slategrey", // 边框颜色
				"stroke_width": stroke_width, // 边框宽度
				"opacity": 0.4, // 透明度
				"fill": "red", //填充色
				"id": "loop",
				"class": { //区别感应区域
					"unused_input": "unused_input", // 未使用输入接口
					"unused_output": "unused_output", //未使用输出接口
					"used_input": "used_input", //已使用输入接口
					"used_output": "used_output" //已使用输出接口
				}
			},
			"link": { //接口间的连线
				"curvature": 0.5, // 线的弯曲率
				"class": "link",
				"stroke": "lightsteelblue", //线的颜色
				"stroke_selected": "navy", // 被选中时线的颜色
				"stroke_width": stroke_width * 3, //线的宽度
				"opacity": 0.5, //透明度
				"fill": "none" //无填充
			}
		},
		"component": { // 容器列表的属性
			"padding": [25, 30], // 容器间的间距
			"class": "component",
			'width': 60,
			'height': 60
			// 'fill': '#96d0ff'
		}
	};

	/*
	 * 根据组件的连接类型绘制相应元素
	 * @param params.container 绘制组件的容器
	 * @param params.data 组件的数据
	 * @param params.component 容器的相关信息
	 * @param params.properties 节点的属性信息
	 * @param params.cla 节点的类信息
	 * TODO: 取消scale，全部采用默认值
	 */
	var type = function(type, params) {
		var component = params.component;
		component.style = publicStyle.component;
		var data = params.data;
		var properties = params.properties;
		var w = component.style.width * (properties.scale ? properties.scale : 1);
		var h = component.style.height * (properties.scale ? properties.scale : 1);
		//ZeroToOne OneToZero OneToOne ManyToOne （以上规则暂无容器组件存在）
		if (type == 'ZeroToMany' || type == 'OneToMany' || type == 'ManyToZero' || type == 'ManyToMany') {
			// todo
			var node = params.container.append("g").attr({
				"class": (params.cla ? params.cla : component.style.class)
			});
			var leftDash = !data.inputLinks ? -1 : (d.inputLinks.length > 0 ? 1 : 0);
			var rightDash = !data.outputLinks ? -1 : (data.outputLinks.length > 0 ? 1 : 0);
			(data.outputLinks && data.outputLinks.length > 0 ? 0 : 1);
			if (data.sid) { // 是容器节点
				shapeFactory.drawArc({
					container: node,
					width: w,
					height: h,
					leftDash: leftDash,
					rightDash: rightDash
				});
			}
			components[component.name]({
				container: node,
				width: w,
				height: h,
				scale: properties.scale
			});
		}

		shapeFactory.drawNodeText(params.container, w / 2, h, params.data);
		//TODO 对于容器中的节点，不需要加节点
		// shapeFactory.drawInte(params.container, properties.interface, params.data);
	};

	var components = {
		/*
		 * 对所有容器
		 * @param params.container 
		 * @param params.width 
		 * @param params.height
		 * @param params.scale 放大缩小的比例
		 */
		'Data Pool': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			var emp = con.append("g").attr("transform", "translate(-11,-26)scale(" + (params.scale ? params.scale + 0.005 : 1) * 0.11 + ")").attr("opacity", 1);
			emp.append("path")
				.attr("d", "m 555.31915,396.51111 a 210.10638,126.06383 0 1 1 -420.21277,0 210.10638,126.06383 0 1 1 420.21277,0 z")
				.attr({
					"transform": "matrix(0.60796214,0,0,0.36558821,167.95262,402.45236)"
				})
				.style({
					"fill": "#eeeeec",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "#2e3436",
					"stroke-width": 17.31880569,
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			emp.append("path")
				.attr("d", "m 555.31915,396.51111 a 210.10638,126.06383 0 1 1 -420.21277,0 210.10638,126.06383 0 1 1 420.21277,0 z")
				.attr({
					"transform": "matrix(0.60796214,0,0,0.36558821,167.95262,375.80344)"
				})
				.style({
					"fill": "#eeeeec",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "#2e3436",
					"stroke-width": 17.31880569,
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			emp.append("path")
				.attr("d", "m 555.31915,396.51111 a 210.10638,126.06383 0 1 1 -420.21277,0 210.10638,126.06383 0 1 1 420.21277,0 z")
				.attr({
					"transform": "matrix(0.60796214,0,0,0.36558821,167.95262,349.15451)"
				})
				.style({
					"fill": "#eeeeec",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "#2e3436",
					"stroke-width": 17.31880569,
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			emp.append("path")
				.attr("d", "m 555.31915,396.51111 a 210.10638,126.06383 0 1 1 -420.21277,0 210.10638,126.06383 0 1 1 420.21277,0 z")
				.attr({
					"transform": "matrix(0.60796214,0,0,0.36558821,167.95262,322.50557)"
				})
				.style({
					"fill": "#eeeeec",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "#2e3436",
					"stroke-width": 17.31880569,
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "green"
			});
		},
		'DataPlayBack': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			var emp = con.append("g").attr("transform", "translate(-45,-73)scale(" + (params.scale ? params.scale : 1) * 0.20 + ")").attr("opacity", 1);
			emp.append("path")
				.attr({
					"d": "m 423.50982,450.18809 a 85.648148,85.185188 0 1 1 6.02847,124.72812",
					"transform": "matrix(0.53355939,0,0,1.0164027,147.62638,-8.2077367)",
				})
				.style({
					"fill": "none",
					"stroke": "#555753",
					"stroke-width": 12.2284441,
					"stroke-linecap": "round",
					"stroke-linejoin": "miter",
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none",
					"stroke-dashoffset": 0,
					"marker-end": "url(#TriangleOutS)"
				});
			emp.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,411.00595,370.35111)",
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			var emp_g = emp.append("g").attr({
				"transform": "matrix(0.75903616,0,0,1,66.2124,-2)"
			});
			emp_g.append("rect")
				.attr({
					"x": 263.40738,
					"y": 462.1922,
					"width": 169.07408,
					"height": 18.259249
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g.append("rect")
				.attr({
					"x": 263.40738,
					"y": 490.85886,
					"width": 169.07408,
					"height": 18.259249
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g.append("rect")
				.attr({
					"x": 263.40738,
					"y": 519.52551,
					"width": 169.07408,
					"height": 18.259249
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g.append("rect")
				.attr({
					"x": 263.40738,
					"y": 548.1922,
					"width": 169.07408,
					"height": 18.259249
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "purple"
			});
		},
		'ForwardAnalysis': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			var emp = con.append("g").attr("transform", "translate(-45,-70)scale(" + (params.scale ? params.scale : 1) * 0.20 + ")").attr("opacity", 1);
			var emp_g1 = emp.append("g").attr({
				"transform": "translate(4,-22)"
			});
			emp_g1.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,385.00595,352.35111)"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g1.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,343.04716,352.59798)"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g1.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,301.08837,352.84484)"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g1.append("rect")
				.attr({
					"x": 282.97131,
					"y": 466.08331,
					"width": 48.732647,
					"height": 48.365555
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});
			var emp_g2 = emp.append("g").attr({
				"transform": "translate(4.9121476,52.340032)"
			});
			emp_g2.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,385.00595,352.35111)"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g2.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,343.04716,352.59798)"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g2.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,301.08837,352.84484)"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g2.append("rect")
				.attr({
					"x": 282.97131,
					"y": 466.08331,
					"width": 48.732647,
					"height": 48.365555
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});

			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "purple"
			});
		},
		'Aggregator': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			var emp = con.append("g").attr("transform", "translate(-50,-78)scale(" + (params.scale ? params.scale + 0.07 : 1) * 0.20 + ")").attr("opacity", 1);
			emp.append("rect")
				.attr({
					"y": 405.71072,
					"x": 374.85184,
					"height": 202.51851,
					"width": 20
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("rect")
				.attr({
					"y": 405.71072,
					"x": 408.85184,
					"height": 202.51851,
					"width": 20
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			var emp_g = emp.append("g").attr({
				"transform": "translate(0,-4)"
			});
			emp_g.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,282.33372,309.66262)",
					"inkscape:transform-center-y": -0.091374688,
					"inkscape:transform-center-x": -7.0472402,
					"inkscape:randomized": 0,
					"inkscape:rounded": 0,
					"inkscape:flatsided": true,
					"sodipodi:arg2": 1.0553275,
					"sodipodi:arg1": 0.0081299022,
					"sodipodi:r2": 61.502033,
					"sodipodi:r1": 123.00406,
					"sodipodi:cy": 445.36218,
					"sodipodi:cx": 281,
					"sodipodi:sides": 3,
					"sodipodi:type": "star"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,282.33372,373.79557)",
					"inkscape:transform-center-y": -0.091374688,
					"inkscape:transform-center-x": -7.0472402,
					"inkscape:randomized": 0,
					"inkscape:rounded": 0,
					"inkscape:flatsided": true,
					"sodipodi:arg2": 1.0553275,
					"sodipodi:arg1": 0.0081299022,
					"sodipodi:r2": 61.502033,
					"sodipodi:r1": 123.00406,
					"sodipodi:cy": 445.36218,
					"sodipodi:cx": 281,
					"sodipodi:sides": 3,
					"sodipodi:type": "star"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp_g.append("path")
				.attr({
					"d": "M 403.99999,446.36218 218.63398,551.3833 220.36603,338.34106 z",
					"transform": "matrix(0.2310979,-0.00102521,7.6709361e-4,0.30885847,282.33372,437.92851)",
					"inkscape:transform-center-y": -0.091374688,
					"inkscape:transform-center-x": -7.0472402,
					"inkscape:randomized": 0,
					"inkscape:rounded": 0,
					"inkscape:flatsided": true,
					"sodipodi:arg2": 1.0553275,
					"sodipodi:arg1": 0.0081299022,
					"sodipodi:r2": 61.502033,
					"sodipodi:r1": 123.00406,
					"sodipodi:cy": 445.36218,
					"sodipodi:cx": 281,
					"sodipodi:sides": 3,
					"sodipodi:type": "star"
				})
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "blue"
			});
		},
		'Detector': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			var emp = con.append("g").attr("transform", "translate(-30,-50)scale(" + (params.scale ? params.scale + 0.07 : 1) * 0.15 + ")").attr("opacity", 1);
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(-2,-6.5)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(-2,58)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(-2,-71)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(60.980653,-6.993374)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(60.980653,57.50663)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(125.98065,57.50663)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 331.77951,537.10484 a 26,26.5 0 1 1 0.091,-0.0787")
				.attr("transform", "translate(126.98065,-72.493374)")
				.style({
					"fill": "#555753",
					"fill-opacity": 1,
					"fill-rule": "evenodd",
					"stroke": "none"
				});
			emp.append("path")
				.attr("d", "m 308.76192,379.65203 c 196.47616,194.48149 196.47616,194.48149 196.47616,194.48149 l 0,0")
				.style({
					"fill": "none",
					"stroke": "#555753",
					"stroke-width": "11.5940876",
					"stroke-linecap": "round",
					"stroke-linejoin": "miter",
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none",
					"display": "inline"
				});
			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "brown"
			});
		},
		'Folder': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			con.append("rect")
				.attr({
					"x": 2 * w / 8,
					"y": 4 * h / 16,
					"width": 4 * w / 8,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			con.append("rect")
				.attr({
					"x": 2 * w / 8,
					"y": 7 * h / 16,
					"width": 2 * w / 8 - 1,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			con.append("rect")
				.attr({
					"x": 2 * w / 8 + (2 * w / 8 + 1),
					"y": 7 * h / 16,
					"width": 2 * w / 8 - 1,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			con.append("rect")
				.attr({
					"x": 2 * w / 8,
					"y": 10 * h / 16,
					"width": 1 * w / 8 - 1.5,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			con.append("rect")
				.attr({
					"x": 2 * w / 8 + (1 * w / 8 + 0.5),
					"y": 10 * h / 16,
					"width": 1 * w / 8 - 1.5,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			con.append("rect")
				.attr({
					"x": 2 * w / 8 + (1 * w / 8 + 0.5) * 2,
					"y": 10 * h / 16,
					"width": 1 * w / 8 - 1.5,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			con.append("rect")
				.attr({
					"x": 2 * w / 8 + (1 * w / 8 + 0.5) * 3,
					"y": 10 * h / 16,
					"width": 1 * w / 8 - 1.5,
					"height": 2 * h / 16
				})
				.attr({
					"fill": "rgb(136,138,133)",
					"opacity": 1
				});
			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "orange"
			});
		},
		'Filter': function(params) {
			var con = params.container;
			var w = params.width;
			var h = params.height;
			var emp = con.append("g").attr("transform", "translate(-30,-50)scale(" + (params.scale ? params.scale + 0.075 : 1) * 0.15 + ")").attr("opacity", 1);
			emp.append("rect")
				.attr({
					"x": 280,
					"y": 410.36218,
					"width": 52.405064,
					"height": 48.911392
				})
				.style({
					"fill": "#555753",
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});
			emp.append("rect")
				.attr({
					"x": 280,
					"y": 477.90649,
					"width": 52.405064,
					"height": 48.911392
				})
				.style({
					"fill": "#555753",
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});
			emp.append("rect")
				.attr({
					"x": 280,
					"y": 545.45081,
					"width": 52.405064,
					"height": 48.911392
				})
				.style({
					"fill": "#555753",
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});
			emp.append("rect")
				.attr({
					"x": 438,
					"y": 443.90649,
					"width": 52.405064,
					"height": 48.911392
				})
				.style({
					"fill": "#555753",
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});
			emp.append("rect")
				.attr({
					"x": 438,
					"y": 511.45081,
					"width": 52.405064,
					"height": 48.911392
				})
				.style({
					"fill": "#555753",
					"fill-rule": "evenodd",
					"stroke": "none",
					"display": "inline"
				});
			emp.append("path")
				.attr("d", "m 306,432.36218 161,37")
				.attr({
					"fill": "#555753",
					"stroke": "#555753",
					"stroke-width": 13.04962349,
					"stroke-linecap": "round",
					"stroke-linejoin": "miter",
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			emp.append("path")
				.attr("d", "M 306.96231,571.237 467.03769,534.44949")
				.attr({
					"fill": "#555753",
					"stroke": "#555753",
					"stroke-width": 13.04962349,
					"stroke-linecap": "round",
					"stroke-linejoin": "miter",
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			emp.append("path")
				.attr("d", "M 307.96231,502.237 468.03769,465.44949")
				.attr({
					"fill": "#555753",
					"stroke": "#555753",
					"stroke-width": 13.04962349,
					"stroke-linecap": "round",
					"stroke-linejoin": "miter",
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			emp.append("path")
				.attr("d", "m 306,502.36218 161,37")
				.attr({
					"fill": "#555753",
					"stroke": "#555753",
					"stroke-width": 13.04962349,
					"stroke-linecap": "round",
					"stroke-linejoin": "miter",
					"stroke-miterlimit": 4,
					"stroke-opacity": 1,
					"stroke-dasharray": "none"
				});
			shapeFactory.drawNodeBackground({
				container: con,
				width: w,
				height: h,
				url: "yellow"
			});
		}
	};

	var shapeFactory = {
		/*
		 * 根据不同类别生成不同接口
		 * @param container 绘制接口的容器
		 * @param interface_prop 接口的属性
		 * @param data 当前节点的数据
		 */
		'drawInterface': function(container, interface_prop, data) {
			var interfaceO = container.append("g").attr("class", "output").selectAll("." + interface_prop.cla).data(d.outputInterfaces).enter();
			var interfaceI = container.attr("class", "input").selectAll("." + interface_prop.cla).data(d.inputInterfaces).enter();
			if (data.type == "ZeroToMany" || data.type == "ManyToMany") {
				this.RectInterface(interfaceO, interface_prop);
				this.RectInterface(interfaceI, interface_prop);
			}
			if (data.type == "OneToMany") {
				this.RectInterface(interfaceO, interface_prop);
				this.circleInterface(interfaceI, interface_prop);
			}
		},
		/*
		 * 生成矩形的接口 - 用在具有多个接口的节点上
		 * @param container 绘制接口的容器
		 * @param properties 接口的属性
		 * @param cla 自定义class
		 */
		'RectInterface': function(container, properties, cla) {
			container.append('rect')
				.attr({
					'x': function(d) {
						return d.x > 0? (d.x -1): (d.x + 1);
					},
					'y': function(d) {
						return d.y;
					},
					'id': function(d) {
						return buildId.interface(d);
					}
				})
				.attr({
					'width': properties.width,
					'height': properties.height,
					'class': (cla ? cla : properties.cla),
					'stroke': properties.stroke,
					'stroke-width': properties.stroke_width,
					'fill': properties.fill,
					'opacity': properties.opacity,
					'display': "none",
					'rx': 2 // 使矩形产生圆角
				});
		},
		/*
		 * 生成圆形的接口 - 用在具有单个接口的节点上
		 * @param container 绘制接口的容器
		 * @param properties 接口的属性
		 */
		'circleInterface': function(container, properties) {
			container.append('circle')
				.attr({
					'cx': function(d) {
						return d.x < 0? 0: d.x;
					},
					'cy': function(d) {
						return d.y + properties.height / 2;
					},
					'r': properties.height / 2,
					'id': function(d) {
						return buildId.interface(d);
					},
					'class': properties.class,
					'stroke': properties.stroke,
					'stroke-width': properties.stroke_width,
					'fill': properties.fill,
					'opacity': properties.opacity,
					'display': function (d) {
						return (d.loopcla == 'unused_output')? 'block': 'none';
					}
				})
		},
		/*
		 * 生成可连接接口的感应区域
		 * @param container 放置所有接口的容器
		 * @param properties 接口的属性
		 * @param loopProperty 接口感应区域的属性
		 * @param type 接口类型 'input'/'output' 
		 */
		'loopArea': function(container, properties, loopProperty, type) {
			var node = container.data(); // 当前节点的数据信息
			if (!node) return;
			var index = d3.tango().findInterfaceUnused(node[0][type + "Interfaces"]);
			if (!index) return;
			var curInterface = node[0][type + "Interfaces"][index - 1];
			// 创建感应区域
			container.selectAll("#" + loopProperty.id).data([curInterface])
				.enter()
				.append('circle')
				.attr({
					'cx': function(d) {
						return d.x < 0? 0: d.x;
					},
					'cy': function(d) {
						return d.y + properties.height / 2;
					},
					'r': properties.width * 4,
					'id': loopProperty.id,
					'fill': loopProperty.fill,
					'opacity': loopProperty.opacity
				});
		},
		/*
		 * 绘制节点下方的文本信息
		 * @param container 放置文本内容的容器
		 * @param x 位置信息
		 * @param y 位置信息
		 * @param data 当前节点的数据
		 */
		'drawNodeText': function(container, x, y, data) {
			var name = componentUtils.getComponentName(data.values); // 获取该节点的名称
			name ? null : name = d.name; // TODO d.name只在容器类别的数据中存在，实际容器的数据中无name属性
			name = DataFlowUtil.utils.subString(name, 11);
			// 创建文字背景
			var len = 7; // 硬编码调整
			var rect = container.append("rect")
				.attr({
					"x": x - len / 2,
					"y": y + 9,
					"width": len,
					"height": 15,
					"rx": 2,
					"fill": "white",
					"fill-opacity": 0.7,
					"class": "name_fill"
				});
			// 创建文本
			var text = container.append("text")
				.attr({
					"x": x,
					"y": y + 20,
					"text-anchor": "middle",
					"fill": "#7CC4FF",
					"class": "name_text"
				})
				.style({
					"font-size": 12
				})
				.text(name);
			if (text && text[0] && text[0][0] && text[0][0].getComputedTextLength()) {
				var len = 7 + text[0][0].getComputedTextLength(),
					textHeight = 15/*getClientHeight(text[0][0])*/;
				text.attr({
					y: y + textHeight + 2
				});
				rect && rect.attr({
					x: x - len / 2 - 2,
					y: y + 2,
					width: len + 5,
					height: textHeight + 4
				});
			}
		},
		/*
		 * 绘制节点的背景椭圆
		 * @param params.container 绘制背景的容器
		 * @param params.width 容器的宽度
		 * @param params.height 容器的高度
		 * @param params.url 背景的填充颜色
		 * TODO 是否可以将椭圆改为一个
		 */
		'drawNodeBackground': function(params) {
			var container = params.container;
			var w = params.width;
			var h = params.height;
			var url = "url(#" + params.url + ")";
			container.append("ellipse")
				.attr({
					"cx": w / 2,
					"cy": h / 2,
					"rx": w / 2 - 5,
					"ry": h / 2 - 5,
					"class": "ellipse_on",
					"fill-opacity": 0.5
				})
				.style({
					"fill": url
				})
				.classed({
					"background_ellipse": true
				});
			// 触发mouseover事件的椭圆
			container.append("ellipse")
				.attr({
					"cx": w / 2,
					"cy": h / 2,
					"rx": w / 2 - 5,
					"ry": h / 2 - 5,
					"class": "ellipse_over",
					"fill-opacity": 0.5
				})
				.style({
					"fill": url
				})
				.classed({
					"background_ellipse": true
				});
		},
		/*
		 * 绘制节点的两边的弧形线
		 * @param params.container 绘制外弧的容器
		 * @param params.width 容器的宽度
		 * @param params.height 容器的高度
		 * @param params.leftDash 左弧线的类型（-1：无弧线，0 虚线，1 实线  ： 没有连接时用虚线表示）
		 * @param params.rightDash 优弧线的类型
		 */
		'drawArc': function(params) {
			var container = params.container;
			var w = params.width;
			var h = params.height;
			var leftDash = params.leftDash;
			var rightDash = params.rightDash;
			// 创建左右弧线
			var left = container.append("path")
				.attr("d", "M" + (w / 4 - 1) + " " + 0.3 * h / 4 + "A" + w / 2 + " " + h / 2 + " 0 0 0 " + (w / 4 - 1) + " " + 3.7 * h / 4)
				.attr({
					"fill": "white",
					"stroke-width": 2,
					"stroke": "rgb(136,138,133)",
					"opacity": 0.5,
					"class": "inputPointer"
				})
				.classed({
					"flag_pointer": true,
					"flag_input": true
				});
			var right = container.append("path")
				.attr("d", "M" + (3 * w / 4 + 1) + " " + 0.3 * h / 4 + "A" + w / 2 + " " + h / 2 + " 0 0 1 " + (3 * w / 4 + 1) + " " + 3.7 * h / 4)
				.attr({
					"fill": "white",
					"stroke-width": 2,
					"stroke": "rgb(136,138,133)",
					"opacity": 0.5,
					"class": "outputPointer"
				})
				.classed({
					"flag_pointer": true,
					"flag_output": true
				});
			changeLineStyle(left, leftDash);
			changeLineStyle(right, rightDash);

			// 改变线条类型
			function changeLineStyle(line, style) {
				if (style == -1) {
					line.attr("display", "none");
				} else if (style == 0) {
					line.attr("stroke-dasharray", [7, 2]); // 虚线
				} else {
					line.attr("stroke-dasharray", "none");
				}
			}
		}
	};

	var ModelUtils = {
		/*
		 * 根据ID查找对应模型数据
		 * @param model_ID 模型数据的ID
		 * @return data 查找到的数据，若无返回null
		 */
		'getModelDataById': function(model_ID) {
			if (!model_ID) return null;
			for (var i = 0; i < SystemValues.Models.length; i++) {
				if (SystemValues.Models[i].id == model_ID) {
					return SystemValues.Models[i];
				}
			}
			return null;
		},
		/*
		 * 在当前模型数据不存在的情况下，添加模型数据
		 * @param model_data 需要添加的模型数据
		 * return status
		 *        -1：表明传入的参数有误
		 *         0：该Model已存在
		 *         1：添加成功
		 */
		'addModelData': function(model_data) {
			var status = -1;
			if(model_data && model_data.id) {
				if(!this.getModelDataById(model_data.id)) {
					SystemValues.Models.push(model_data);
					status = 1;
				} else {
					status = 0;
				}
			}
			return status;
		},
		// 根据国际化规则修改模型及其组件的名称（用于显示）
		'modelNameI18N': function(model_data) {
			if (model_data) {
				var I18Nobj = I18N_Dataflow.database;
				for (var key in model_data) {
					if (I18Nobj) {
						var name = stringApi.trimAndLowerCase(model_data[key].name);
						I18Nobj[name] ? model_data[key].values.name[0] = I18Nobj[name] : null;
					}
					model_data[key].style = publicStyle.component;
					if (model_data[key].subComponents) {
						ModelUtils.modelNameI18N(model_data[key].subComponents);
					}
				}
			}
		},
		/*
		 * 格式化从数据库中取出的数据
		 * @param modelData 需要进行格式化的数据
		 * @return 格式化后的model对象
		 */
		formatModelData: function(modelData) {
			var model = {
				id: modelData.id,
				db_id: modelData.db_id,
				name: modelData.name,
				runStatus: modelData.runStatus,
				saveStatus: false,
				data: {
					nodes: modelData.nodes,
					links: modelData.links
				},
				values: modelData.values
			};
			// 对模型中的节点数据进行进一步的处理
			var nodes = model.data.nodes;					
			for (var i = 0; i < nodes.length; i++) {
				for(var key in SystemValues.LibraryComponents) {
					// 当前容器类别中有该容器存在
					if (SystemValues.LibraryComponents[key].subComponents[nodes[i].sid]) {
						nodes[i].cid = key;
						break;
					}
				}
				var name = SystemValues.LibraryComponents[nodes[i].cid].subComponents[nodes[i].sid].name;
				if (name == "DataPlayBack" || name == "ForwardAnalysis") {
					// profiles属性只有这两个容器包含
					if (nodes[i].values && nodes[i].values["profiles"]) {
						var pStr = nodes[i].values["profiles"];
						if (pStr && pStr.length > 0) {
							var profile = [];
							for (var j = 0; j < pStr.length; j++) {
								var obj = {};
								var pValues = pStr[j].split(";");
								for (var k = 0; k < pValues.length; k++) {
									var KV = pValues[k].split(":");
									obj[KV[0]] = KV[1] == "true" ? true : (KV[1] == "false" ? false : KV[1]);
								};
								profile.push(obj);
							}
							nodes[i].values["profiles"] = profile;
						}
					}
				}
			}
		}
	};

	var componentUtils = {
		// 遍历属性查找容器的名称
		'getComponentName': function(values) {
			var name = "";
			for (var key in values) {
				if (key == "name") {
					name = values[key][0];
					break;
				}
			}
			return name;
		},
		/*
		 *
		 * @params params.type 容器类型
		 * @params params.node 节点信息
		 * @params params.links 连接信息
		 */
		'getPropertyValues': function(params) {
			var obj = {
				"TOOLS": {
					"empty1Array": false
				},
				"Data Pool": function(this_params) {
					return this_params.node.values;
				},
				"DataPlayBack": function(this_params) {
					return this_params.node.values;
				},
				"ForwardAnalysis": function(this_params) {
					return this_params.node.values;
				},
				"Aggregator": function(this_params) {
					return this_params.node.values;
				},
				"Folder": function(this_params) {
					var links = this_params.links,
						node = this_params.node;
					var result = findLinksByFlagid(links, "input", node.id),
						link = false;
					if (result.length > 0) {
						for (var i = 0; i < result.length; i++) {
							if (SystemValues.LibraryComponents[result[i].output.cid].subComponents[result[i].output.sid].name == "Data Pool") {
								link = result[i];
								break;
							}
						}
						if (link) {
							result = findLinksByFlagid(links, "input", link.output.id);
							if (result.length > 0) {
								link = result[0]; //DP只有一个stream
								!node.values.eventfieldUnselect ? node.values.eventfieldUnselect = [] : null;
								!node.values.eventfieldSelected ? node.values.eventfieldSelected = [] : null;
								if (link.output.values.maxFoldLevel) {
									if (!node.values.tempValue) {
										node.values.tempValue = [];
									}
									node.values.tempValue[0] = link.output.values.maxFoldLevel[0];
								}
								var preefs = link.output.values.eventfieldSelected;
								if (preefs && preefs.length > 0) {
									var fields = node.values.eventfieldUnselect;
									node.values.eventfieldUnselect = [];
									for (var i = 0; i < fields.length; i++) {
										if (findEleInO_DArray(preefs, fields[i]) != -1) {
											node.values.eventfieldUnselect.push(fields[i]);
										}
									}
									fields = node.values.eventfieldSelected;
									node.values.eventfieldSelected = [];
									for (var i = 0; i < fields.length; i++) {
										if (findEleInO_DArray(preefs, fields[i]) != -1) {
											node.values.eventfieldSelected.push(fields[i]);
										}
									}
									fields = node.values.eventfieldUnselect.concat(node.values.eventfieldSelected);
									for (var i = 0; i < preefs.length; i++) {
										if (findEleInO_DArray(fields, preefs[i]) == -1) {
											node.values.eventfieldUnselect.push(preefs[i]);
										}
									}
								} else {
									empty();
									$.popup.topMsg("Please add some properties to the previous component first!");
								}
							} else {
								empty();
							}
						} else {
							empty();
						}
					} else {
						empty();
					}

					function empty() {
						if (getPropertyValues.TOOLS.empty1Array) {
							getPropertyValues.TOOLS.empty1Array();
						} else {
							node.values.eventfieldUnselect = [];
							node.values.eventfieldSelected = [];
						}
					}

					function reset(pros) {
						empty();
						for (var i = 0; i < pros.length; i++) {
							node.values.eventfieldUnselect.push(pros[i]);
						}
					}
					return node.values;
				},
				"Detector": function(this_params) {
					var node = this_params.node;
					getPropertyValues.TOOLS.empty1Array = function() {
						node.values.eventfieldUnselect = [];
						node.values.eventfieldSelected = [];
						node.values.eventfieldDetect = [];
					};
					var values = getPropertyValues.Folder(this_params);
					getPropertyValues.TOOLS.empty1Array = false;
					return values;
				},
				"Filter": function(this_params) {
					return getPropertyValues.Folder(this_params);
				}
			};
			return obj[params.type](params);
		}
	};

	var searchLink = {
		/*
		 * 根据连接的ID值查找对应连接
		 * @param links 连接信息
		 * @param link_id 需要查找的连接的ID值
		 * @return 返回符合条件的连接对象
		 */
		'findLinkByID': function(links, link_id) {
			for (var i = 0; i < links.length; i++) {
				if (links[i].id == link_id) {
					return links[i];
				}
			}
			return null;
		},
		/*
		 * 根据ID组查找对应连接
		 * @param params.links 连接信息
		 * @param params.flag 连接标识 input/output
		 * @param params.flagids 由节点ID组成的ID，包含输入输出节点的信息
		 * @return 返回符合条件的连接对象
		 */
		'findLinkByFlagids': function(params) {
			var links = params.links;
			for (var i = 0; i < links.length; i++) {
				if (links[i][params.flag + "Ids"] == params.flagids) {
					return links[i];
				}
			}
			return null;
		},
		/*
		 * 根据输入输出节点ID查找对应连接
		 * @param links 连接信息
		 * @param O_ID 输出节点的ID值
		 * @param I_ID 输入节点的ID值
		 * @return 返回符合条件的连接，否则返回null
		 */
		'findLinkByOID&IID': function(links, O_ID, I_ID) {
			for (var i = 0; i < links.length; i++) {
				if ((links[i].input == I_ID && links[i].output == O_ID) || (links[i].input.id == I_ID && links[i].output.id == O_ID)) {
					return links[i];
				}
			}
			return null;
		},
		/*
		 * 根据ID值查找符合标识的对应连接
		 * @param params.links 连接信息
		 * @param params.flag 连接标识 input/output
		 * @param params.ID 需要查找的ID值
		 * @return 返回符合条件的所有连接
		 */
		'findLinksByFlag&ID': function(params) {
			var links = params.links;
			var result = [];
			for (var i = 0; i < links.length; i++) {
				if (links[i][params.flag] == params.ID || links[i][params.flag].id == params.ID) {
					result.push(links[i]);
				}
			}
			return result;
		}
	};

	var buildId = {
		"canvas": function(canvas_data) { //生成画布ID
			return canvas_data + "_canvas";
		},
		"canvas_fill": function(canvas_data) { // 生成画布背景元素（rect）的ID
			return canvas_data + "_fill";
		},
		"node_container": function(node) { // 生成节点的ID
			return "node_g_" + node.id;
		},
		'interface': function(interface_data) {  // 根据数据生成ID
			// "interface_" + 接口类型及状态 + "_" + 连接信息
			return "interface_" + interface_data.loopcla + "_" + interface_data.ids;
		},
		"link": function(t_ps) { //生成连线的ID值
			// "link_" + 输出节点的ID + "_" + 输入节点的ID
			return "link_" + t_ps.link.output.id + "_" + t_ps.link.input.id;
		}
	};

	var utils = {
		/* 截取字符串，处理超出长度范围的字符串 eg：str = abcdefg num = 4 ==> abcd...
		 * @param str 需要处理的字符串
		 * @param num 字符串的限制长度
		 * @return 处理后的字符串
		 */
		'subString': function(str, num) {
			var result = "";
			if (str && str.length > num) {
				result = str.substring(0, num - 1);
				result += "...";
			} else {
				result = str;
			}
			return result;
		},
		// 将字符串改为小写
		"trimAndLowerCase": function(str) {
			var result = "";
			if (str) {
				result = str.replace(" ", "");
				result = result.toLowerCase();
			}
			return result;
		},
		// 判断一个对象是否为空
		'isEmpty': function(obj) {
			if(obj) {
				for (var key in source) {
					return false;
				}
			}
			return true;
		},
		/*
		 * 在数组中查找元素并返回索引值
		 * @param arr 被查找的数组
		 * @param ele 需要查找的元素
		 * @return 索引值
		 */
		'findEleIndexInArray': function(arr, ele) {
			var index = -1;
			if (arr) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == ele) {
						index = i;
						break;
					}
				}
			}
			return index;
		}
	};

	// 容器的qtip显示的内容
	var getQtipsHTML = {
		"Model": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true),
				html = "";
			html += (d.name ? d.name : "");
			html += "&nbsp;[" + (I18N_Dataflow.model[d.runStatus]) + "]";
			template.append(html);

			return template;
		},
		"Data Pool": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true);
			template.find(".name").append((values.name ? values.name[0] : ""));
			template.find(".stream-name").append((values.streamName ? values.streamName[0] : ""));

			return template;
		},
		"DataPlayBack": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true);
			template.find(".name").append((values.name ? values.name[0] : ""));
			template.find(".start-time").append((values.searchStartTime ? values.searchStartTime[0] : ""));
			template.find(".end-time").append((values.searchEndTime ? values.searchEndTime[0] : ""));
			template.find(".offset").append((values.offset ? values.offset[0] : ""));
			template.find(".query-period").append((values.period ? values.period[0] : ""));
			template.find(".query-span").append((values.querySpan ? values.querySpan[0] : ""));
			template.find(".time-ratio").append((values.ratio ? values.ratio[0] : ""));
			template.find(".send-period").append((values.clockSendFrequency ? values.clockSendFrequency[0] : ""));
			template.find(".filter").append((values.filter ? values.filter[0] : ""));
			var ps = values.profiles;
			if (ps && ps.length) {
				var html = "";
				for (var i = 0; i < ps.length; i++) {
					html += "<tr><td>" + (ps[i].proName ? ps[i].proName : " ") + "</td><td>" + (ps[i].activeFlag ? I18N_Dataflow.profile.actived : " ") + "</td></tr>";
				}
				template.find(".profile").append(html);
			}

			return template;
		},
		"ForwardAnalysis": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true),
				html = "";
			template.find(".name").append((values.name ? values.name[0] : ""));
			var efs = values.eventfieldSelected;
			if (efs && efs.length) {
				for (var i = 0; i < efs.length; i++) {
					var a = efs[i].split(";");
					html += "<tr><td>" + a[0] + "</td><td>" + (a[1] == "eq" ? "=" : "!=") + "</td><td>" + a[2] + "</td></tr>";
				}
			}
			template.find(".filter-field").append(html);
			var ps = values.profiles;
			if (ps && ps.length) {
				var html = "";
				for (var i = 0; i < ps.length; i++) {
					html += "<tr><td>" + (ps[i].proName ? ps[i].proName : " ") + "</td><td>" + (ps[i].activeFlag ? I18N_Dataflow.profile.actived : " ") + "</td></tr>";
				}
				template.find(".profile").append(html);
			}

			return template;
		},
		"Aggregator": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true),
				html = "";
			template.find(".name").append((values.name ? values.name[0] : ""));
			var efs = values.eventfieldSelected;
			if (efs && efs.length) {
				for (var i = 0; i < efs.length; i++) {
					var a = efs[i].split(";");
					html += "<tr><td>" + a[0] + "</td><td>" + FieldListType[a[1]] + "</td><td>" + FieldListOperate[a[2]] + "</td></tr>";
				}
			}
			template.find(".event-field").append(html);

			return template;
		},
		"Folder": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true),
				html = "";
			template.find(".name").append((values.name ? values.name[0] : ""));
			var efs = values.eventfieldSelected;
			if (efs && efs.length) {
				for (var i = 0; i < efs.length; i++) {
					var a = efs[i].split(";");
					html += "<tr><td>" + a[0] + "</td><td>" + FieldListType[a[1]] + "</td><td>" + FieldListOperate[a[2]] + "</td></tr>";
				}
			}
			template.find(".selected-field").append(html);
			template.find(".out-folding").append((values.maxFoldLevel ? FoldingLevel[values.maxFoldLevel[0]] : ""));
			template.find(".in-folding").append((values.inFoldLevel ? FoldingLevel[values.inFoldLevel[0]] : ""));

			return template;
		},
		"Filter": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true),
				html = "";
			template.find(".name").append((values.name ? values.name[0] : ""));
			var efs = values.eventfieldSelected;
			if (efs && efs.length) {
				for (var i = 0; i < efs.length; i++) {
					var a = efs[i].split(";");
					html += "<tr><td>" + a[0] + "</td><td>" + FieldListType[a[1]] + "</td><td>" + FieldListOperate[a[2]] + "</td></tr>";
				}
			}
			template.find(".selected-field").append(html);
			template.find(".in-folding").append((values.maxFoldLevel ? FoldingLevel[values.maxFoldLevel[0]] : ""));

			return template;
		},
		"Detector": function(t_ps) {
			var type = t_ps.type,
				d = t_ps.data,
				values = d.values;
			var template = $("#propertyQtip").find("#" + type.replace(" ", "_")).find(".component_qtips").clone(true),
				html = "";
			template.find(".name").append((values.name ? values.name[0] : ""));
			var efs = values.eventfieldSelected;
			if (efs && efs.length) {
				for (var i = 0; i < efs.length; i++) {
					var a = efs[i].split(";");
					html += "<tr><td>" + a[0] + "</td><td>" + FieldListType[a[1]] + "</td><td>" + FieldListOperate[a[2]] + "</td></tr>";
				}
			}
			template.find(".selected-field").append(html);
			html = "";
			var efd = values.eventfieldDetect;
			if (efd && efd.length > 0) {
				for (var i = 0; i < efd.length; i++) {
					if (efd[i]) {
						var a = efd[i].split(";");
						html += "<tr><td>" + a[0] + "</td><td>" + FieldListType[a[1]] + "</td><td>" + FieldListOperate[a[2]] + "</td></tr>";
					}
				}
			}
			template.find(".detect-field").append(html);

			return template;
		}
	};

	/******************************************************
	 * 弹出对话框|可浮动提示信息
	 * ***************************************************/
	var popupMsg = {
		/*
		 * @param params.msg 要显示的信息
		 * @param params.container 显示信息的容器
		 * @param params.type 信息的类型
		 */
		"alert": function(params) {
			var msg = params.msg,
				container = params.container,
				classes = this.getClasses(params.type);
			$.popup.alert(msg);
		},
		"topMsg": function(params) {
			var msg = params.msg,
				container = params.container,
				classes = this.getClasses(params.type);
			$.popup.topMsg({
				msg: msg,
				container: container,
				classes: classes
			});
		},
		"getClasses": function(type) {
			var classes = "";
			switch (type) {
				case "INFOR":
					classes = "topMsg-infor";
					break;
				case "TIPS":
					classes = "topMsg-tips";
					break;
				case "ERROR":
					classes = "topMsg-error";
					break;
			}
			return classes;
		}
	};

	// 图形渲染
	function addRendering(container) {
		var defs = container.append("defs");
		var radialGradient_blue = defs.append("radialGradient")
			.attr({
				"id": "blue",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var radialGradient_brown = defs.append("radialGradient")
			.attr({
				"id": "brown",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var radialGradient_green = defs.append("radialGradient")
			.attr({
				"id": "green",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var radialGradient_orange = defs.append("radialGradient")
			.attr({
				"id": "orange",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var radialGradient_purple = defs.append("radialGradient")
			.attr({
				"id": "purple",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var radialGradient_red = defs.append("radialGradient")
			.attr({
				"id": "red",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var radialGradient_yellow = defs.append("radialGradient")
			.attr({
				"id": "yellow",
				"cx": 0.5,
				"cy": 0.5,
				"r": 0.5,
				"fx": 0.5,
				"fy": 0.5
			});
		var filter_GaussianBlur = defs.append("filter")
			.attr({
				"id": "Gaussian_Blur"
			});
		radialGradient_blue.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(237,241,253)",
			"stop-opacity": 0.5
		});
		radialGradient_blue.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(148,166,251)",
			"stop-opacity": 1
		});

		radialGradient_brown.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(253,208,167)",
			"stop-opacity": 0.5
		});
		radialGradient_brown.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(202,110,45)",
			"stop-opacity": 1
		});

		radialGradient_green.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(232,255,205)",
			"stop-opacity": 0.5
		});
		radialGradient_green.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(173,245,56)",
			"stop-opacity": 0.9
		});

		radialGradient_orange.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(255,244,179)",
			"stop-opacity": 0.5
		});
		radialGradient_orange.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(254,176,63)",
			"stop-opacity": 1
		});

		radialGradient_purple.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(235,185,253)",
			"stop-opacity": 0.5
		});
		radialGradient_purple.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(178,105,227)",
			"stop-opacity": 1
		});

		radialGradient_red.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(254,220,229)",
			"stop-opacity": 0.5
		});
		radialGradient_red.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(238,126,156)",
			"stop-opacity": 1
		});

		radialGradient_yellow.append("stop").attr({
			"offset": 0,
		}).style({
			"stop-color": "rgb(251,253,146)",
			"stop-opacity": 0.5
		});
		radialGradient_yellow.append("stop").attr({
			"offset": "100%",
		}).style({
			"stop-color": "rgb(230,224,68)",
			"stop-opacity": 1
		});

		filter_GaussianBlur.append("feGaussianBlur")
			.attr({
				"in": "SourceGraphic",
				"stdDeviation": 4
			});
	}

	var systemApi = {
		resetFieldType: function() {
			var source = I18N_Dataflow.property;

			FieldListType.T_STRING = source.string;
			FieldListType.T_INT = source.integer;
			FieldListType.T_BIGINT = source.biginteger;
			FieldListType.T_DOUBLE = source.double;

			FieldListType[source.string] = "T_STRING";
			FieldListType[source.integer] = "T_INT";
			FieldListType[source.biginteger] = "T_BIGINT";
			FieldListType[source.double] = "T_DOUBLE";
		},
		resetFieldOperator: function() {
			var source = I18N_Dataflow.property;

			FieldListOperate.T_GROUP_BY = source.group;
			FieldListOperate.T_SUM = source.sum;
			FieldListOperate.T_COUNT = source.count;
			FieldListOperate.T_MIN = source.minimum;
			FieldListOperate.T_MAX = source.maximum;

			FieldListOperate[source.group] = "T_GROUP_BY";
			FieldListOperate[source.sum] = "T_SUM";
			FieldListOperate[source.count] = "T_COUNT";
			FieldListOperate[source.minimum] = "T_MIN";
			FieldListOperate[source.maximum] = "T_MAX";
		},
		resetFoldingLevel: function() {
			var source = I18N_Dataflow.property;

			FoldingLevel._raw_ = source.raw;
			FoldingLevel._ts_1m_ = source.oneminute;
			FoldingLevel._ts_5m_ = source.fiveminutes;
			FoldingLevel._ts_h_ = source.onehour;
			FoldingLevel._ts_qd_ = source.sixhours;
			FoldingLevel._ts_d_ = source.oneday;
			FoldingLevel._ts_fw_ = source.sevendays;
			FoldingLevel._ts_m_ = source.onemonth;
			FoldingLevel._ts_q_ = source.threemonths;
			FoldingLevel._ts_y_ = source.oneyear;

			FoldingLevel[source.raw] = "_raw_";
			FoldingLevel[source.oneminute] = "_ts_1m_";
			FoldingLevel[source.fiveminutes] = "_ts_5m_";
			FoldingLevel[source.onehour] = "_ts_h_";
			FoldingLevel[source.sixhours] = "_ts_qd_";
			FoldingLevel[source.oneday] = "_ts_d_";
			FoldingLevel[source.sevendays] = "_ts_fw_";
			FoldingLevel[source.onemonth] = "_ts_m_";
			FoldingLevel[source.threemonths] = "_ts_q_";
			FoldingLevel[source.oneyear] = "_ts_y_";
		},
		resetFoldingLevelIndex: function() {
			var source = I18N_Dataflow.property;

			FoldingLevel[source.raw] = 0;
			FoldingLevel[source.oneminute] = 1;
			FoldingLevel[source.fiveminutes] = 2;
			FoldingLevel[source.onehour] = 3;
			FoldingLevel[source.sixhours] = 4;
			FoldingLevel[source.oneday] = 5;
			FoldingLevel[source.sevendays] = 6;
			FoldingLevel[source.onemonth] = 7;
			FoldingLevel[source.threemonths] = 8;
			FoldingLevel[source.oneyear] = 9;
		}
	};

	/*
	 * 绘制节点
	 * @param params.container 绘制节点的容器
	 * @param params.data 节点的数据
	 * @param params.pro 节点的属性
	 * @param params.libraryData 所有组件的信息
	 */
	function drawComponent(params) {
		var nodes = params.container.data(params.data)
		.enter()
		.append('g')
		.attr('transform', function(d){
			return 'translate(' + d.x + ',' + d.y + ')';
		});
		nodes.each(function(d){
			var curComponent = params.libraryData[d.id];
			type(curComponent.type, {
				container: d3.select(this),
				data: d,
				component: curComponent,
				properties: params.prop,
				cla: false
			});
		});
		return nodes;
	}
	return {
		'drawAPI': {
			/*
			 * 绘制节点
			 * @param params.container 绘制节点的容器
			 * @param params.data 节点的数据
			 * @param params.prop 节点的属性
			 * @param params.libraryData 所有类别的信息
			 */
			'drawComponent': function(params) {
				return drawComponent(params)
			},
			/*
			 * 绘制方形接口
			 * @param params.container 绘制接口的容器
			 * @param params.properties 接口的属性
			 * @param params.cla 接口的自定义类名
			 */
			'drawInterface': function(params) {
				return shapeFactory.RectInterface(params.container, params.properties, params.cla);
			},
			/*
			 * 生成可连接接口的感应区域
			 * @param params.container 放置所有接口的容器
			 * @param params.interface_prop 接口的属性
			 * @param params.loopProperty 接口感应区域的属性
			 * @param params.type 接口类型 'input'/'output' 
			 */
			'drawLoop': function(params) {
				return shapeFactory.loopArea(params.container, params.interface_prop, params.loopProperty, params.type);
			},
			// 添加渲染，在生成绘制的容器时添加
			'addRendering': function(container) {
				addRendering(container);
			}
		},
		'commonAPI': {
			'getPublicStyle': function(key) {
				return publicStyle[key];
			},
			'addRendering': function(container) {
				return addRendering(container);
			},
			/*
			 * 节点显示的qtip的内容
			 * param params.type 当前节点类型
			 * param params.data 当前节点的数据
			 */
			'getQtipsHTML': function(params) {
				return getQtipsHTML[params.type](params);
			},
			'showStatus': function(status) {
				var text = $("#operateDescription").find("#operate_description").val();
				text += "\n\n";                                                             
				text += "[Operating time]: " + new Date() + "\n";
				text += status.description;
				$("#operateDescription").find("#operate_description").val(text);
			},
			/*
			 * 显示提示信息
			 * @param params.win 弹窗的类型
			 * @param params.msg 要显示的信息
			 * @param params.container 显示信息的容器
			 * @param params.type 信息的类型
			 */
			'showMsg': function(params) {
				popupMsg[params.win ? params.win : "topMsg"](params);
			}
		},
		'systemAPI': systemApi,
		'buildIdAPI': buildId,
		'ModelUtils': ModelUtils, //TODO 还有部分未整理 arrayapi 如果有用到再整理
		// TODO 考虑是否应该放置到tango里面去
		'searchLinkAPI': searchLink,
		'utils': utils
	}
}();