
<a href="https://localhost:3000/">
    <img src="flashcard-saas/static/headline.png" alt="Cards Against Confusion headline" align="center" />
</a>


<style>
    h1, h2, h3, h4, h5, h6, p {
        color: white;
    }
    a {
        color: #F19Fe6;
    }
    * {
        background-color: black;
    }
</style>

 
# Cards Against Confusion

### Contents

- [Lore](#lore)
- [Running the App](#running-the-app)
- [Features](#key-features)
- [Support](#thank-you-for-your-support-)
- [Contributors](#contributors)
- [Credits](#credits)

## Lore

[We](#contributors) met in a fellowship and were given a challenge - 
create a flashcard app.

We realized we weren't inspired by flashcards and decided to create 
a task management app with a flashcard-inspired-UI. Cards Against Confusion 
uses AI to generate task lists based on user input. Tell the app what you want 
to plan - with or without details - and receive a detailed task list with 
descriptions and tasks ranked by priority.

---

## Running the App

---

```bash
$ npm i
$ npm run dev
```

### Environment variables

NEXT_PUBLIC_FIREBASE_API_KEY <br/>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN <br/>
NEXT_PUBLIC_FIREBASE_PROJECT_ID <br/>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET <br/>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID <br/>
NEXT_PUBLIC_FIREBASE_APP_ID <br/>
NEXT_PUBLIC_FIREBASE_APP_MEASUREMENT_ID <br/>
STRIPE_SECRET_KEY <br/>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY <br/>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY <br/>
CLERK_SECRET_KEY <br/>
OPENAI_API_KEY 

---

## Key Features

![demo](flashcard-saas/static/demo.gif)

<table >
    <tr style="border: none">
        <td style="border: none" align="center" width="350px">
            <div>
                <h3 style="color: white">AI-Generated Task Lists</h3>
                <h3 style="color: white">Auto Task Ranking</h3>
                <h3 style="color: white">Firebase Database Integration</h3>
                <h3 style="color: white">Daily Focus List</h3>
                <h3 style="color: white">Clean, Intuitive Interface</h3>
            </div>
        </td>
        <td  style="border: none" align="center" width="350px">
            <div>
                <h3 style="color: white">Add/Edit/Delete Tasks </h3>
                <h3 style="color: white">Dark/Light mode  </h3>
                <h3 style="color: white">Mobile Responsive</h3>
                <h3 style="color: white">User Authentication</h3>
                <h3 style="color: white">Stripe Payment Integration</h3>
            </div>
        </td>
    </tr>
</table>

           


---

### Thank you for your support! 
[![Star this project](https://img.shields.io/github/stars/zenml-io/zenml?style=social)](https://github.com/katrinars/flashcard-app/stargazers)

Please consider giving us a star on GitHub. Thank you for your support! 🌟


## Contributors


---

## Credits

- This app is heavily inspired by [Bill Zhang](https://medium.com/@billzhangsc/creating-a-flashcard-saas-with-openai-and-stripe-7896ddea1dbb).
- [Cards Against Humanity](https://www.cardsagainsthumanity.com/) - name and design inspiration.

--

[Back to top](#cards-against-confusion)
