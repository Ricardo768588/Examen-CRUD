const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Mock Data (Solo como ejemplo, reemplaza esto con la integración real de tu base de datos)
let nextId = 1;
let menu = [
    { id: nextId++, name: 'Sushi de salmón', descripcion: 'Delicioso sushi de salmón fresco.', precio: 10.99, imagen: 'sushi_salmon.jpg' },
    { id: nextId++, name: 'Roll tempura', descripcion: 'Roll crujiente con tempura de camarón.', precio: 12.99, imagen: 'roll_tempura.jpg' },
    { id: nextId++, name: 'Sashimi variado', descripcion: 'Selección de sashimi fresco de pescado variado.', precio: 15.99, imagen: 'sashimi_variado.jpg' }
];

// Routes
app.get('/productos', (req, res) => {
    res.json(menu);
});

app.post('/productos', (req, res) => {
    const newProduct = { id: nextId++, ...req.body };
    menu.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/productos/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = menu.findIndex(product => product.id === productId);
    if (index === -1) {
        res.status(404).json({ message: 'Producto no encontrado' });
    } else {
        menu[index] = { ...menu[index], ...req.body };
        res.json(menu[index]);
    }
});

app.delete('/productos/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = menu.findIndex(product => product.id === productId);
    if (index === -1) {
        res.status(404).json({ message: 'Producto no encontrado' });
    } else {
        const deletedProduct = menu.splice(index, 1);
        res.json(deletedProduct[0]);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
