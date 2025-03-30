# Fortooling

--
api :

- <https://api.fortooling.forhives.fr/_/>
- See our vaultwarden for password and credentials

## Dev

## how to run the project

`bun install`
`bun run dev`
`ngrok http 3000`

We get the ngrok url , and we setup this one in the webhook list from clerk
-> we need to change every webhook secret / endpoint for every webhook locally needed

for example, we can have :

- <https://8a82-90-12-63-1.ngrok-free.app/api/webhook/clerk/organization>
- <https://8a82-90-12-63-1.ngrok-free.app/api/webhook/clerk/user>
- <https://8a82-90-12-63-1.ngrok-free.app/api/webhook/clerk/...>
