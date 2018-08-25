processId=$(ps -ef | grep 'indexLight' | grep -v 'grep' | awk '{ printf $2 }')
sudo kill -9 $processId
cd /home/pi/Desktop/Hom-E_LightActuator/
git pull
node indexLight.js
