@echo off
echo Dang mo port 8081 cho Expo...
netsh advfirewall firewall add rule name="Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081
powershell -Command "Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private"
echo.
echo ==============================================
echo DA MO KET NOI THANH CONG!
echo Bay gio ban co the mo Expo Go quet ma QR roi.
echo ==============================================
pause
