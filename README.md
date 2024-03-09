# Своя игра

Кастомная реализация многопользовательской игры на базе "Своя игра". 
Помимо дефолтного функционала подразумевалось наличие других режимов.
Изначально планировалась как внутренний продукт. Разные уровни ролей со своими привелегиями, отдельный
websocket сервер для ряда режимов, растащить функционал по разным сервисам.
Пилил бесплатно факультативно по вечерам, стопнул про причине смены места работы 🤡

## Основной стек

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- по мелочи zod, nodemailer smtp, и пр.

## Что успел реализовать
- dev БД убрал в докер, накинул seed-метод для ролей
- runtime валидация env переменных
- регистрация/аутентификация/авторизация пока с одним провайдером (логин/пароль) + JWT
- свой шаблонизатор для писем (подтверждение регистрации, смена/восстановление пароля и т.п.)
- функционал модерации учетных записей (помимо регистрации необходимо получить подтвержение учетной записи от администратора)
