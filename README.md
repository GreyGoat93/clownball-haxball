# strangeball-haxball
This is a Haxball Headless Room called Strangeball that I programmed.

# How To Run?

- Clone this repo.
- In the clone file, open terminal and type `npm install` then press enter.
- In the clone file, copy `env.example` file and paste as `.env` . Then fill the `.env` file. If you don't use discord webhook, you don't need to enter link there.
-- `TOKEN` is needed to pass captcha. You can get the token from [here](https://www.haxball.com/headlesstoken).
-- `GEO_CODE` is needed for which country flag you want the room has. It accepts two letter country codes like: `TR`, `PL`, `US`
-- `GEO_LAT` is your rooms latitude. Needed!
-- `GEO_LON` is your rooms longtitude. Needed also!
-- `USE_*_WEBHOOK` is enables logging for logging player chat, matches, visits, leaves, bugs. With `1` value it is enabled and with `0` value it is disabled. 
-- `*_WEBHOOK_URL` link to your discord webhook. Not needed if you set `USE_*_WEBHOOK` to `false`.
- Then, in terminal, type `npm start` then press enter.
