
const {
    EnapsoGraphDBClient
} = require("@innotrade/enapso-graphdb-client"); // connection data to the run GraphDB instance

const GRAPHDB_BASE_URL = "http://localhost:7200",
    GRAPHDB_REPOSITORY = "RecipeBook",
    GRAPHDB_USERNAME = "sharedUser",
    GRAPHDB_PASSWORD = "user123",
    GRAPHDB_CONTEXT_TEST = "http://www.semanticweb.org/simeon/ontologies/2023/0/untitled-ontology-2#";

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: "chef",
        iri: "http://www.semanticweb.org/simeon/ontologies/2023/0/untitled-ontology-2#",
    }
];

let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: DEFAULT_PREFIXES
});

graphDBEndpoint.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
    .then((result) => {
        console.log("\x1b[36m", result);
    }).catch((err) => {
        console.log("\x1b[31m", err);
    });

const express = require('express')
const app = express()
const cors = require('cors')



app.use(express.json())
app.use(cors())
app.use('/public', express.static('public'))

app.post('/available-recipes', function (req, res) {
    graphDBEndpoint
        .query(
            fillAvailableRecipesQuery(req.body.basketName)
        )
        .then((result) => {
            res.send(result.results.bindings);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/create/basket', function (req, res) {
    graphDBEndpoint
        .update(
            req.body.query
        )
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
})

function fillAvailableRecipesQuery(basket) {
    return `
    SELECT ?recipe ?basket ?maxCookCount ?directions WHERE {
    {
        SELECT ?recipe ?basket ?directions (MIN(?cookCount) AS ?maxCookCount) (COUNT(*) as ?availableProductCount) WHERE {
            ?recipe chef:requires ?recipeContainer .
            ?recipeContainer chef:holds ?recipeProduct .
            ?recipe chef:directions ?directions .
            ?basket chef:contains ?basketContainer .
            FILTER (?basket=chef:${basket}) .
            ?basketContainer chef:holds ?basketProduct .
            FILTER (?recipeProduct=?basketProduct) .
            ?recipeContainer chef:measuringUnits ?recipeProductUnit .
            ?basketContainer chef:measuringUnits ?basketProductUnit .
            FILTER (?recipeProductUnit=?basketProductUnit) .
            ?recipeContainer chef:quantity ?recipeQuantity .
            ?basketContainer chef:quantity ?basketQuantity .
            FILTER (?basketQuantity >= ?recipeQuantity) .
            BIND((?basketQuantity / ?recipeQuantity) AS ?cookCount)
        }
        GROUP BY ?recipe ?basket ?directions
    } .
    {
        SELECT (?recipe AS ?requiredRecipe) (COUNT(*) as ?requiredProductCount) WHERE {
            ?recipe chef:requires ?recipeContainer .
            ?recipeContainer chef:holds ?product
        } 
        GROUP BY ?recipe
    } .
    FILTER (?recipe = ?requiredRecipe) .
    FILTER (?requiredProductCount <= ?availableProductCount)
}
`
}

app.listen(3000, () => console.log("\x1b[33m", "Server Started"))
