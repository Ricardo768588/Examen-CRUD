import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
    const [menu, setMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        descripcion: '',
        precio: '',
        imagen: null
    });

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await axios.get('URL_DE_TU_API');
                setMenu(response.data);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        };

        fetchMenuData();
    }, []);

    const filterProducts = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleChange = e => {
        if (e.target.name === 'imagen') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            
            if (menu.some(producto => producto.name === formData.name)) {
                console.log('Este producto ya está agregado.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('descripcion', formData.descripcion);
            formDataToSend.append('precio', formData.precio);
            formDataToSend.append('imagen', formData.imagen);

            const response = await axios.post('URL_DE_TU_API', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMenu([...menu, response.data]);
            setFormData({
                name: '',
                descripcion: '',
                precio: '',
                imagen: null
            });
        } catch (error) {
            console.error('Error al crear un nuevo producto:', error);
        }
    };

    const handleDelete = async productId => {
        try {
            await axios.delete(`URL_DE_TU_API/${productId}`);
            setMenu(menu.filter(producto => producto.id !== productId));
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    return (
        <div>
            <header>
                <div className="logo">
                    <h1>Sakura Sushi Bar</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#productos">Menú</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <section id="crear" className="crear">
                    <h2>Crear Nuevo Producto</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="descripcion"
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={formData.precio}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            name="imagen"
                            onChange={handleChange}
                        />
                        <button type="submit">Agregar Producto</button>
                    </form>
                </section>
                <section id="productos" className="productos">
                    <div className="container">
                        <h2>Nuestro Menú de Sushi</h2>
                        <div className="search-container">
                            <input
                                type="text"
                                id="searchInput"
                                placeholder="Buscar productos..."
                                onChange={filterProducts}
                                value={searchTerm}
                            />
                        </div>
                        <div className="productos-container">
                            {menu
                                .filter(producto =>
                                    producto.name.toLowerCase().includes(searchTerm) ||
                                    producto.descripcion.toLowerCase().includes(searchTerm)
                                )
                                .map(producto => (
                                    <div className="producto" key={producto.id}>
                                        <img src={`URL_DE_TU_API/${producto.imagen}`} alt={producto.name} />
                                        <h3>{producto.name}</h3>
                                        <p>{producto.descripcion}</p>
                                        <p>Precio: ${producto.precio.toFixed(2)}</p>
                                        <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            </main>
            <footer>
                <div className="container">
                    <p>&copy; 2024 Sakura Sushi Bar - Todos los derechos reservados</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
