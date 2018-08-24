# coding: utf-8
import socket
from yeelight import Bulb
from yeelight import discover_bulbs
import sys 
import time
ip = "192.168.0.23"
bulb = Bulb(ip)

socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
socket.bind(('127.0.0.1', 1111))
#possible command : set on|off
socket.listen(5)
client, address = socket.accept()
print("{} connected".format( address ))

def handleCommand(command):
    if command == 'set':
        arg = response.split(' ')[1]
        if arg == 'on':
            bulb.turn_on()
        elif arg == 'off':
            bulb.turn_off()
        client.send("success")
while True:
    try:
        response = client.recv(255)
        if response != "":
            print("Python server received : {}".format(response))
            command = response.split(' ')[0]
            handleCommand(command)
    except Exception as e:
        print("Error : {}".format(e))
        client.send("disconnected")
        found = False
        while not(found):
            bulbs = discover_bulbs()
            print(bulbs)
            for b in bulbs:
                if b['ip'] == ip:
                    found = True
                    client.send("reconnected")
        time.sleep(1)
        handleCommand(command)

sys.stdout.write("Close")
client.close()
stock.close()