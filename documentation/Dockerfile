FROM python:alpine AS build

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN mkdocs build

FROM nginx:alpine

COPY --from=build /app/site/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
