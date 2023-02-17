# CookBuddy
CookBuddy is a rule based system which suggests it's user recipes they can cook depending on a available ingredients list.

* Ingredients data includes: **name**, **quantity** and **measuring units**
* Recipe data includes: **name**, **required ingredients** and **directions**

## System structure

* **GraphDB** - local NoSQL database representing our data in the form of a graph
* **SPARQL** - Query language used to retrieve required data from **GraphDB**
* **Node.js server** - local server used to receive post requests from the system's front-end, consume the sent data, compose **SPARQL** queries and use them on our **GraphDB** database.
* **Public folder** - Contains a simple *html* page with *javascript* used to send requests to our **node.js** server

## Ontology structure
Our ontology is comprised of 4 classes: **Ingredient**, **Container**, **IngredientBasket**, **Recipe**

* **Ingredient** - A simple class that only determines the name of an ingredient
* **Container** - Class that *holds* certain *quantity* of a *measuringUnit* for an *Ingredient*
* **IngredientBasket** - Class that *contains* multiple *Containers* with *Ingredients*
* **Recipe** - Class representing a recipe that *requires* multiple *Containers* with *Ingredients*

## Requirements to use the system

`node.js` `GraphDB`

## Use the system
To use the system you must first start the `GraphDB` server. (See online [documentation](https://graphdb.ontotext.com/documentation/10.1/))

You must create a new `user` for your `GraphDB` server and change the connection credentials in `script.js`

After that you can use `sample_recipes.owl` ontology to add some demo data.

Start the `node.js` server:

```
$ node script.js
```
This starts our `node.js` server on port `3000`. It automatically connects to our `GraphDB` server which by default runs on port `7200`.

Open a web browser and type in `http://localhost:3000/public/`.
You can now use the system. 👨‍💻🚀