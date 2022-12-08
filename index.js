function makeElement(kind, text = null, attr = {}, event = {}) {
	const elem = document.createElement(kind);
	if(text !== null) elem.innerHTML = text;
	for(const prop in attr) elem[prop] = attr[prop];
	for(const evt in event) elem.addEventListener(evt, event[evt]);
	return elem;
}
function setStockError(text) {
	if(seid) clearTimeout(seid);
	stockError.textContent = text;
	seid = setTimeout(() => {
		stockError.textContent = '';
		seid = 0;
	}, 2000);
}
function rmStock(elem, id) {
	stock[id] = null;
	elem.parentNode.parentNode.parentNode.remove();
	localStorage.setItem('pokapoka', JSON.stringify(stock));
}
function changeStock(a, r, c, t, e) {
	stock[a].data[r][c] = t.textContent * 1;
	localStorage.setItem('pokapoka', JSON.stringify(stock));
	e.textContent = stock[a].data[r][0] + crop[r].unit * (stock[a].data[r][1] + stock[a].data[r][2]);
}
function initStock(t) {
	if(t.textContent == '0') t.textContent = '';
}
function setStock(t) {
	if(!t.textContent) t.textContent = '0';
	t.textContent = t.textContent.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));// 65248
}
class Crop {
	static parentNode = document.getElementById('crops');
	constructor(name, min, unit, price, rareBonus, eventPrice, bb = false) {
		this.name = name;//string
		this.min = min;//float|int
		this.unit = unit;//int
		this.price = price;//int[]
		this.rareBonus = rareBonus;//int[]
		this.eventPrice = eventPrice;//int[]
		this.CP = this.price[0] !== null ? this.price[0] * this.unit : null;
		this.EP = this.eventPrice[0] !== null ? this.eventPrice[0] * this.unit : null;
		const tr = makeElement('tr');
		if(bb) tr.className = 'bb';
		tr.appendChild(makeElement('th', this.name, {className: 'br'}));
		tr.appendChild(makeElement('td', this.min + '分'));
		tr.appendChild(makeElement('td', 1.2 * this.min + '秒'));
		tr.appendChild(makeElement('td', this.unit, {className: 'br'}));
		tr.appendChild(makeElement('td', this.price[0]));
		tr.appendChild(makeElement('td', this.price[1]));
		tr.appendChild(makeElement('td', this.price[2], {className: 'br'}));
		tr.appendChild(makeElement('td', this.rareBonus[0]));
		tr.appendChild(makeElement('td', this.rareBonus[1], {className: 'br'}));
		tr.appendChild(makeElement('td', this.eventPrice[0]));
		tr.appendChild(makeElement('td', this.eventPrice[1]));
		tr.appendChild(makeElement('td', this.eventPrice[2], {className: 'br'}));
		tr.appendChild(makeElement('td', this.CP));
		tr.appendChild(makeElement('td', this.EP));
		Crop.parentNode.appendChild(tr);
	}
}
class Stock {
	static parentNode = document.getElementById('stock');
	constructor(acc, data = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]) {
		this.acc = acc;
		this.data = data;
		const n = stock.length, li = makeElement('li'), table = makeElement('table'), thead = makeElement('thead'), tbody = makeElement('tbody');
		table.appendChild(makeElement('caption', `${acc}<button onclick="rmStock(this,${stock.length});">削除</button>`));
		let tr = makeElement('tr');
		tr.appendChild(makeElement('th', '作物', {className: 'br'}));
		tr.appendChild(makeElement('th', '納屋'));
		tr.appendChild(makeElement('th', '栽培'));
		tr.appendChild(makeElement('th', '種'));
		tr.appendChild(makeElement('th', '在庫'));
		thead.appendChild(tr);
		table.appendChild(thead);
		for(const i in data) {
			tr = makeElement('tr');
			tr.appendChild(makeElement('td', crop[i].name, {className: 'br'}));
			tr.appendChild(makeElement('td', data[i][0], {contentEditable: true}, {input: function() { changeStock(n, i, 0, this, td); }, focus: function() { initStock(this); }, blur: function() { setStock(this); }}));
			tr.appendChild(makeElement('td', data[i][1], {contentEditable: true}, {input: function() { changeStock(n, i, 1, this, td); }, focus: function() { initStock(this); }, blur: function() { setStock(this); }}));
			tr.appendChild(makeElement('td', data[i][2], {contentEditable: true}, {input: function() { changeStock(n, i, 2, this, td); }, focus: function() { initStock(this); }, blur: function() { setStock(this); }}));
			tr.appendChild(makeElement('td', data[i][0] + crop[i].unit * (data[i][1] + data[i][2])));
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		li.appendChild(table);
		Stock.parentNode.appendChild(li);
	}
}
const crop = [
	new Crop('かぶ', 0.5, 3, [1, 2, 3], [50, 8], [null, null, null]),
	new Crop('にんじん', 1, 3, [3, 5, 6], [100, 8], [null, null, null]),
	new Crop('たまねぎ', 5, 3, [13, 18, 26], [150, 8], [null, null, null]),
	new Crop('キャベツ', 30, 2, [60, 85, 120], [200, 12], [null, null, null]),
	new Crop('トマト', 120, 2, [130, 190, 260], [400, 12], [null, null, null]),
	new Crop('とうもろこし', 180, 2, [200, 300, 400], [600, 12], [null, null, null]),
	new Crop('りんご', 300, 2, [340, 510, 680], [800, 12], [null, null, null]),
	new Crop('みかん', 420, 1, [1000, 1500, 2000], [2200, 18], [null, null, null]),
	new Crop('サルビア', 540, 1, [1300, 1900, 2600], [2600, 18], [null, null, null]),
	new Crop('クレマチス', 720, 1, [2000, 3000, 4000], [3500, 18], [null, null, null], true),
	new Crop('ポロネギ', 15, 5, [null, null, null], [null, null], [100, 150, 250]),
	new Crop('アネモネ', 120, 5, [null, null, null], [null, null], [1000, 1500, 2500]),
	new Crop('クランベリー', 300, 5, [null, null, null], [null, null], [1500, null, null])
], stock = [], acc = document.getElementById('acc'), stockError = document.getElementById('stockError');
let seid = 0;
if(localStorage.getItem('pokapoka')) {
	JSON.parse(localStorage.getItem('pokapoka')).forEach(item => {
		if(item === null) return;
		stock.push(new Stock(item.acc, item.data));
	});
}
localStorage.setItem('pokapoka', JSON.stringify(stock));
document.getElementById('addStock').addEventListener('click', () => {
	if(acc.value === '') {
		setStockError('アカウント名を入力してください。');
		return;
	}
	stock.push(new Stock(acc.value));
	localStorage.setItem('pokapoka', JSON.stringify(stock));
	acc.value = '';
});