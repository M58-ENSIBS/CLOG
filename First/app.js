var total_erreur=0;

function Check(checksum) {
	var tab="                   azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789_$&#@";
	var mot=document.forms[0].elements[0].value;
	var n=mot.length;
	var sum=1;
	for (var i=0;i<n;i++) {
		var index=tab.indexOf(mot.substring(i,i+1));
		sum=sum+(index*n*i)*(index*i*i);
	}
	if (sum==checksum) {window.location=mot+".html"; }
	else {
		total_erreur++; 
		alert("Mauvais mot de passe");
		if (total_erreur>2) { // apres 3 essais, redirection...
			alert("Désolé, vous avez atteint les 3 essais");
		}
	}	
	return false;
	
}


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