lint:
	make -C frontend lint

test:
	make -C frontend test

install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start:
	make start-backend & make start-frontend