studio:
	npx prisma studio

dbpush:
	npx prisma db push
	npx prisma generate

dbpull:
	npx prisma db pull
	npx prisma generate


install:
	npm install
	npx prisma generate

run:
	npm run dev

build:
	npm run build

seed:
	node scripts/seed.js

FORMAT_FILES := "**/*.{js,jsx,ts,tsx,json,css,scss,md}"
format:
	npx prettier --write $(FORMAT_FILES)