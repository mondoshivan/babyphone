#!/usr/bin/env bash

ssh -p 14090 root@lyra.et-inf.fho-emden.de rm -fR /root/babyphone/angular/dist
scp -r -P 14090 ./dist root@lyra.et-inf.fho-emden.de:/root/babyphone/angular/dist
