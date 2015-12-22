/**
 * table plugins
 * 自定义table生产插件, 用于当前项目的bmob连接方式
 * @param  {obj} options 
 * @return {api}        
 */
var geraltTable = function(options) {
	const COL_HOLDER = 'GERALTTABLE_COL_HOLDER';
	// table tr td 与 div+css区别: 
	// tr,td组合表格可以适用于需要rowspan, colspan的复杂条件下使用,其他与div+css表格基本无区别
	// div+css表格优势：布局语义化, 适合SEO, 简化代码,但不适合在复杂条件下使用
	// tr, td优势: 稳定,传统,适用性广
	/////////////////////
	// 本例默认div布局 //
	/////////////////////
	const TABLESTYLE = 'TRTD';
	const DIVSTYLE = 'DIVCSS';
	var dataSource = options.dataSource,
		selector = options.selector,
		tableStyle = options.tableStyle==TABLESTYLE ? TABLESTYLE : DIVSTYLE,
		// e.g. {'k':v,'k2':v2}
		rowMap = options.rowMap,
		rowCreated = options.rowCreated,
		rowCreating = options.rowCreating,
		// page para
		paging = options.paging,
		sort = options.sort,
		// 数据是否来自远程
		dataRemote = options.dataRemote;
	// public method
	var api = {};

	function generateTableRow(rowData) {
		var output = tableStyle===DIVSTYLE ? "<div class='tableRow'>" :"<tr>";
		$.each(rowMap, function(k, f) {
			var finalresult = rowData;
			output += tableStyle===DIVSTYLE ? "<div class='tableCol'>" : "<td>";
				// 是否取rowData中的对象元素
			if (k.split('.').length > 1) {
				//取rowData中的对象元素
				$.each(k.split('.'), function(i, val) {
					finalresult = finalresult[val];
				});
			} else {
				if(k==COL_HOLDER){
					finalresult = rowData;
				}else{
					finalresult = rowData[k];
				}
			}
			if ($.isFunction(f)) {
				// 调用colum的生成函数
				output += f(finalresult, rowData);
			} else {
				output += finalresult;
			}
			output +=  tableStyle===DIVSTYLE ? "</div>" : "</td>"
		});
		output += tableStyle===DIVSTYLE ? "</div>" : "</tr>";
		var row = $(output);
		$(selector).append(row);
		if ($.isFunction(rowCreated)) {
			rowCreated(row,rowData);
		}
		return row;
	}
	function generateTablePagination(){
		if(dataRemote){
			var result = paging.generateCallback(paging.pagingTemplate,paging.subPageTemplate,api.page)
			$(paging.paginationSelector).append(result);
			paging.generatedCallback(api.page);
		}
	}
	function generateTable() {
		if (paging) {
			if(paging.paginationSelector && $(paging.paginationSelector).length==1){
				$(paging.paginationSelector).empty();
			}
			api.page.goPage(1);
			return;
		}
		$(selector).empty();
		$.each(dataSource, function(index, data) {
			generateTableRow(data);
		});
		// if(dataSource.length===0){
		// 	$(selector).parent().parent().append("<span style='margin-left:300px;margin-top:100px' id='noDataHolder'>"+i18N_searchInput.getLocal('noData')+"</span>");
		// }else{
		// 	$('#noDataHolder').remove();
		// }
	}

	function draw(ds) {
		$(selector).empty();
		$.each(ds, function(index, data) {
			generateTableRow(data);
		});
		// pagination 
		if(paging){
			if(paging.paginationSelector && $(paging.paginationSelector).length==1){
				if($(paging.paginationSelector).html().trim()=="" || api.page.rebuildpager){
					$(paging.paginationSelector).empty();
					generateTablePagination();
				}
			}
		}
	}
	function drawRow(rowData,callback){
		var row =generateTableRow(rowData);
		if($.isFunction(callback)){
			callback(row);
		}
	}
	api.page = function() {
		var page = {};
		var pageSize,
			pageNum,
			total=1,
			countTotal = 0;

		if (!paging) {
			return false;
		}
		page.rebuildpager = false;
		page.goPage = function(num) {
			switch(num){
				case "prev":
					if(pageNum<=1){
						return false;
					}
					num = (--pageNum);
					page.rebuildpager = (num%10==0); 
					break;
				case "next":
					if(total && total==pageNum){
						return false;
					}
					num = (++pageNum);
					page.rebuildpager = (num%10==1); 
					break;
				case "first":
					if(pageNum==1){
						return false;
					}
					num = 1;
					break;
				case "last":
					if(pageNum==total){
						return false;
					}
					num = total;
					break;
				default :
					num = parseInt(num);
					break;
			}
			if (dataRemote) {
				// traditional style paging
				if(dataRemote.url){
					var dataUrl = dataRemote.url,
						params = {},
						loadingTemp = dataRemote.loading ? $(dataRemote.loading()) : undefined;
					if (paging) {
						params[dataRemote.pageNumName_req] = num;
						params[dataRemote.pageSizeName_req] = pageSize;
					}
					if(loadingTemp){
						$(selector).closest('.tableContainer').parent().append(loadingTemp);
					}
					$(selector).css('opacity','0.8')
					$.ajax({
						url: dataUrl,
						type: 'GET',
						dataType: 'json',
						data: params,
					})
					.done(function(data) {
						if(loadingTemp){
							$(loadingTemp).remove()
						}
						$(selector).css('opacity','1')
						var result = dataRemote.callback(data);
						if(!result) return false;
						dataSource  = result.dataSource;
						// set meta data if needs later
						data = result.metaData ? result.metaData : data;
						// update paging details
						total = Math.ceil(data[dataRemote.pageTotal]/pageSize);
						countTotal = data[dataRemote.pageTotal];
						
						pageNum = data[dataRemote.pageNumName];
						pageSize = data[dataRemote.pageSizeName];

						// draw table
						draw(dataSource)
					})
					.fail(function() {
						console.log("error");
					})
					return true;
				}
				// bmob style paging
				if(dataRemote.bmob){
					var query = dataRemote.bmob,
						loadingTemp = dataRemote.loading ? dataRemote.loading : undefined;
					if(loadingTemp){
						if($.isFunction(loadingTemp.start)){
							loadingTemp.currentLoader =loadingTemp.start();
						}
					}
					// get total
					query.count({
						success: function(result) {
							countTotal = result;
							total = Math.ceil(result/pageSize);
						},
						error: function(err){
							console.error(err);
						}
					});
					query.limit(pageSize).skip(pageSize*(num-1)).find({
						success: function(results){
							if(loadingTemp){
								if($.isFunction(loadingTemp.stop)){
									loadingTemp.stop(loadingTemp.currentLoader) 
								}
							}
							dataSource =dataRemote.callback(results);
							draw(dataSource);
							pageNum = num;
						},
						error: function(err){
							console.error(err)
						}
					})
					return true;
				}
			}
			if (Math.ceil(dataSource.length / pageSize) >= num) {
				var nowDs = dataSource.slice((num - 1) * pageSize, pageSize * num);
				pageNum = num;
				draw(nowDs)
			} else {
				return false;
			}
		}
		page.pageSize = function(psize) {
			if (psize) {
				pageSize = psize;
				return page;
			}
			return pageSize;
		}
		page.pageNum = function(pnum) {
			if (pnum) {
				pageNum = pnum;
				return page;
			}
			return pageNum
		}
		page.pageTotal = function(ptotal){
			if(ptotal){
				total = ptotal;
				return page;
			}
			return total;
		}
		page.countTotal = function(){
			return countTotal;
		}
		page.initpage = function() {
			pageSize = paging.pageSize;
			pageNum = 1;
		}()

		return page;
	}();

	api.draw = function(data){
		draw(data);
	}
	// draw a row(not update whole table), often use for add a row
	api.drawRow = function(data,callback){
		drawRow(data,callback);
	}
	// work only in dataRemote mode 
	api.flush = function(){
		if(!dataRemote) return false;
		api.page.goPage(1);
	}
	generateTable();
	return api;
}
