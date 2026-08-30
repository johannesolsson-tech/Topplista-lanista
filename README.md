# Lanista Topplista Bot v1

Separat från Kajsa-ordrar.

## Railway-variabler
DISCORD_TOKEN = tokenen för den nya topplistebotten
TOPLIST_CHANNEL_ID = kanalens Discord-ID
UPDATE_SECRET = en egen lång hemlighet

## Publik Railway-domän
Service -> Settings -> Networking -> Public Networking -> Generate Domain

## GitHub
Ladda upp:
- index.js
- package.json
- railway.json
- .gitignore
- README.md

Koppla sedan repot till en ny Railway-service.

## Edge-bokmärke
Öppna `bookmarklet-generator.html` lokalt.
Fyll i din Railway URL och samma UPDATE_SECRET.
Klicka Skapa kod.
Skapa en favorit i Edge och klistra in hela javascript:-koden som URL.

När du är inloggad på lanista.se klickar du bokmärket.
Det hämtar topp 20 och klan 5-medlemmarna i din webbläsare, matchar gladiatornamn lokalt och skickar endast matchade topplisteposter till botten.

## Discord-behörigheter
Botten behöver:
- View Channel
- Send Messages
- Read Message History

Message Content Intent behövs inte.
