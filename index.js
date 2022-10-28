(function () {
	var iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	window.console = iframe.contentWindow.console;

	// 查看传入的日期是否是节假日
	const isHoliday = (date) => {
		const holidays = [
			'1-01',
			'1-24',
			'1-25',
			'1-26',
			'1-27',
			'1-28',
			'1-29',
			'1-30',
			'4-04',
			'4-05',
			'4-06',
			'5-01',
			'5-02',
			'5-03',
			'5-04',
			'5-05',
			'6-25',
			'6-26',
			'6-27',
			'9-12',
			'10-1',
			'10-2',
			'10-3',
			'10-4',
			'10-5',
			'10-6',
			'10-7'
		];
		// 查看日期的月份和日期是否在节假日列表中
		return holidays.includes(`${date.getMonth() + 1}-${date.getDate()}`);
	};

	// 判断传入的日期是否是周末
	const isWeekend = (date) => {
		// 跳过需要上班的调休日, 尽管调休日是周六周天
		const fuckDays = ['10-8', '10-9'];
		let isFuckDay = fuckDays.includes(`${date.getMonth() + 1}-${date.getDate()}`);
		if(isFuckDay) return false;
		// 如果是周六或者周天, 则返回true
		return date.getDay() === 6 || date.getDay() === 0;
	};

	console.log(
		'==== 请开始滚动消息列表 (在7秒内随意滚动, 用于程序收集数据, 滚动的数据区间务必要在当前月份之内) ===='
	);
	const date = new Date();
	const month = date.getMonth() + 1;
	date.setDate(1);
	// 从月初开始到月末, 排除节假日和周末
	const workDay = [];
	while (date.getMonth() + 1 === month) {
		if (!isHoliday(date) && !isWeekend(date)) {
			workDay.push(date.getDate());
		}
		date.setDate(date.getDate() + 1);
	}
	// 计算工作日天数
	var needWorkDay = workDay.length;
	console.log('[计算结果😄] 当月工作日天数应为: ', needWorkDay);
	// 保存消息列表的已提交信息数组
	var result = new Set();
	// 获取消息列表已经提交的工时
	const getWorkList = () => {
		var workList = document.querySelectorAll('[col-id="subject"]');
		for (let i = 0; i < workList.length; i++) {
			// 获取子div中属性col-id为subject的子div, 并取其子类span的内容
			const subject = workList[i].children[0].innerText;
			// 匹配一下年份和月份以及其他信息
			// 匹配 “工作日-工时加班20220913014已经审批通过”
			const reg = /工作日-工时加班(\d{4})(\d{2})(\d{2})(\d{3})已经审批通过/;
			const match = subject.match(reg);
			if (match) {
				// 获取日期 例如0913, 转换为时间对象
				const workDate = new Date(`${match[1]}-${match[2]}-${match[3]}`);
				// 查看获取出来的日期, 是否是本月的日期
				if (workDate.getMonth() + 1 === month) {
					// 将天数保存到数组中
					result.add(workDate.getDate());
				}
			}
		}
	};

	var second = 0;

	var timer = setInterval(() => {
		getWorkList();
		second += 0.07;
		console.log(`已经滚动了${second}秒, 程序已经收集到${result.size}条数据 (${month}月)`);
		if (second >= 7) {
			clearInterval(timer);
			console.log('==== 滚动结束, 开始计算 ====');
			// 获取已经提交的天数
			const days = [...result].reverse();
			// 如果days数组内容和工作日天数相同, 则说明已经提交了所有的工作日
			
			if (days.length === needWorkDay) {
				console.log('恭喜你, 本月已经提交了所有的工作日');
			} else {
				// 循环workDay
				for (let i = 0; i < needWorkDay; i++) {
					if (!days.includes(workDay[i])) {
						console.log('[计算结果😄] 未提交的日期为: ', workDay[i]);
					}
				}
			}
		}
	}, 100);
})();
