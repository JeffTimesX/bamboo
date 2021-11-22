FROM nginx:latest

STOPSIGNAL SIGQUIT

COPY ./nginx.conf /home/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]

