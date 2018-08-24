#!/usr/bin/env python# coding: utf-8

import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("127.0.0.1", 1111))

print("Ecrivez votre message :")
while True:
    message = raw_input(">> ") # utilisez raw_input() pour les anciennes versions py$s.send(message)
    r = s.send(message)
print("Reponse du serveur : %s." % r)
s.close()