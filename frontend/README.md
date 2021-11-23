after run `npm run build`, and `npm i -g serve`, run `serve -s build`, the -s flag will rewrite all the non-found request to index.html.

this config of serve will resolve the 404 error which represents that the user agent is redirected back from auth0 authentication endpoint.

try to find the equivelent configuration for nginx, and make nginx serve the frontend within the docker container for the production to replace the node serve for the dev.


