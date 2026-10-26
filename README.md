# Järnpakten – Topplistan

Visar alla gladiatorer på Lanistas globala topp 20 för dagens XP vars **ägare** har minst en gladiator i **Järnpakten (klan 2)**. Gladiatorn på topplistan behöver alltså inte själv tillhöra klanen.

Visar endast gladiatornamn, XP, global placering och grad – inga profilnamn eller Discord-ping.

## Så fungerar bokmärket

1. Hämtar `/api/clans/2/members?paginate=false` och samlar unika `avatar.user_id`.
2. Hämtar `/api/avatars/livetoplist?type=todays_xp`.
3. Hämtar `/api/avatars/{id}` för var och en av de 20 topplistegladiatorerna och läser `user_id`.
4. Filtrerar på ägarens `user_id` och skickar matchande gladiatorer till Railway.

Generera ett **nytt bokmärke** från `bookmarklet-generator.html` med befintlig Railway-URL och `UPDATE_SECRET`. Det gamla bokmärket uppdateras inte automatiskt.

Befintliga Railway-variabler och `index.js` är oförändrade. Bokmärket måste köras inloggad på Lanista. API-strukturen är verifierad mot exempel från Lanistas Developer Tools, men den nya lösningen är **inte live-testad**.
