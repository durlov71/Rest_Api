const express = require('express');

const app = express();
const Joi = require('joi');

const { v4: uuidv4 } = require('uuid');




app.get('/', (req, res) => {
    return res.send('HELLO FROM API')
})

const products = [{
        id: '1',
        name: 'Mango',
        price: '150'
    },
    {
        id: '2',
        name: 'lichi',
        price: '300'
    },
    {
        id: '3',
        name: 'Orange',
        price: '220'
    }
];
// show all products
app.get('/api/products', (req, res) => {
    res.json(products)
})

//Show a specific products
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = products.find(pro => id === pro.id)
    if (!product) {
        return res.status(404).json({
            'error': "products not found with this ID"
        })
    }
    return res.json(product)
})

// Insert a specific product

// midddle ware 
app.use(express.json());
app.post('/api/products', (req, res) => {

    const { error } = validation(req.body);
    if (error) {
        return res.status(404).json({
            message: error.details[0].message
        })
    }
    const pro = req.body;

    const product = {
        id: uuidv4(),
        name: pro.name,
        price: pro.price
    }
    products.push(product)
    return res.json(product)
})

// UPDATE products using PUT method
app.put('/api/products/:id', (req, res) => {
    const { error } = validation(req.body);
    if (error) {
        return res.status(404).json({
            message: error.details[0].message
        })
    }
    const index = products.findIndex(prod => prod.id === req.params.id)
    if (index === -1) {
        return res.status(404).json({
            "error": "no products found with this id"
        })
    }

    products[index].name = req.body.name
    products[index].price = req.body.price
    return res.json({
        product: products[index]
    })

})


// UPDATE products using PATCH method
app.patch('/api/products/:id', (req, res) => {
    const index = products.findIndex(prod => prod.id === req.params.id)
    if (index === -1) {
        return res.status(404).json({
            "error": "products not find with this id"
        })
    }
    let updatedProducts = {
        ...products[index],
        ...req.body
    }
    products[index] = updatedProducts;
    return res.send(updatedProducts)
})

function validation(body) {
    const schema = Joi.object({

        name: Joi.string().min(3).max(20).required(),
        price: Joi.number().required()
    })
    return schema.validate(body);

}


// DELETE a specific product 
app.delete('/api/products/:id', (req, res) => {
    const product = products.find(prod => prod.id === req.params.id)
    if (!product) {
        return res.status(404).json({
            'message': 'product not found with this id'
        })
    }
    const index = products.findIndex(prod => prod.id === req.params.id)
    products.splice(index, 1)
    return res.json(product);
})

// DELETE all products
app.delete('/api/products', (req, res) => {
    products.splice(0);
    return res.json(products)
})


app.listen(3000, () => console.log("Server is Running at port 3000"))