// Solving the challenge
let tab = "                   azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789_$&#@";
// Known checksum = 48528559
let checksum = 48528559;
let flag = "";
let n = 0;
let sum = 0;
let i = 0;
let index = 0;
while (sum != checksum) {
	flag = "";
	n++;
	sum = 1;
	for (i = 0; i < n; i++) {
		index = 0;
		while (index < 1 || index > 74) {
			index = Math.floor(Math.random() * 100);
		}
		flag += tab.substring(index, index + 1);
		index = tab.indexOf(flag.substring(i, i + 1));
		sum = sum + (index * n * i) * (index * i * i);
	}
}
console.log(flag);
