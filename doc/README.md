# Z App

## Intro

this app is for people who is searching job, and Companies that are searching workers. it's simplify the way for both to find the best job/candidate in the minor possible time.

![](https://media2.giphy.com/media/ToMjGpJ4jULsUli8yxW/giphy.gif?cid=790b7611a1622d9c10ff727845c981c0fe9a38be01f5b55a&rid=giphy.gif&ct=g)

## Functional Description

### Use Cases

Company
- Create an offer
- Update an offer
- Delete an offer
- View published curriculums
- search specific curriculums
- like and dislike curriculums
- match with a curriculum that he likes
- retrieve matchs


Worker
- Create an curriculum
- Update an curriculum
- Delete an curriculum
- View published offers
- search specific offers
- like and dislike offers
- match with a offer that he likes
- retrieve matchs

## Technical Description

### Blocks

```
App (client-side)        API (server-side)       DB
[React > logic > xhr] -> [Express > Mongoose] -> [Mongo]
```

### Data Model

**User**
- name (String, required)
- email (String, required, unique)
- password (String, required)
- role: (String, enum)

**Offer**
- user (ObjectId, required)
- published (Boolean)
- title (String)
- description (String)
- photo (String)
- createDate (Date)
- salary: {Salary}
- location: (String)
- modality: (String, enum)
- workTime: (String, enum)
- languages: [Language]
- studies: [ofStudy]
- experiences: [ofExperience]
- knowledge: [knowledge]

knowledge
- title: (String)
- level: (String, enum)

ofStudy
- title: (String, required),
- years: (String)

ofExperience
- position: (String, required)
- years: (String)

salary
- salary: (Number)
- currency: (String)

**Curriculum**
- user (ObjectId, required)
- title (String, required)
- description (String, required)
- photo (String)
- createDate (Date, required)
- location (String)
- languages: [Language]
- studies: [cvStudy]
- experiences: [cvExperience]

cvStudy
- institution. (String, required)
- title: (String, required),
- from: (Date, required)
- to: (Date)

cvExperience
- company: (String, required)
- position: (String, required)
- from: (Date, required)
- to: (Date)

Language
- language: (String, enum)
- level: (String, enum)

**Matchs**
- offer (ObjectId)
- curriculum (ObjectId)

### Technologies

- JavaScript
- React
- Node
- Express
- Mongo
- Mongoose
- Tailwind
- HTML

## Planning

__BACKLOG__

- implement offer and curriculum compatibility
- impement chat between matchs

__TODO__

- Improve matchs notifications
- See offers/curriculums that gave like to you
- Test logic in server-side
- Home page
- Upload images

__DOING__

- matchs notifications

__REVIEW__


__DONE__

- choose role (worker/company) when the user register
- create, update and delete curriculums/offers
- publish and unpublish curriculums/offers
- requirements to publish
- unable to update when the curriculum/offer is published
- see published curriculums/offers
- search curriculums/offers by key word and/or location
- like or dislike a curriculum/offer
- choose curriculum/offer to give the like
- match when curriculum and offer gives like each other
- notificate when you have new matchs and how many
- see your matchs, and the detail of each one
- dislike the match