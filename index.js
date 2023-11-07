const express = require('express');
const uuid = require('uuid');
const app = express();
app.use(express.json());

const port = 5000;

const orders = [];

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(orderData => orderData.id === id)

    if(index < 0){
        return response.status(404).json({error: 'Order Not Found'})
    }

    request.orderIndex = index
    request.orderId = id

    next()

}

const showMethodAndUrl = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`Request Method = ${method} and URL = ${url}`);

    next()
}

app.get('/order', showMethodAndUrl, (request, response)=> {
    return response.json(orders)
});

app.post('/order', showMethodAndUrl, (request, response)=> {

    console.log(request)
    const { order, clientName, price } = request.body

    const orderData = { id: uuid.v4(), order, clientName, price, status:"Em preparação"}

    orders.push(orderData)

    return response.status(201).json(orderData)
});

app.put('/order/:id', checkOrderId, showMethodAndUrl, (request, response)=> {
    const { order, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order, clientName, price, status:orders[index].status }

    orders[index] = updateOrder

    return response.json(updateOrder)
});

app.delete('/order/:id', checkOrderId, showMethodAndUrl, (request, response)=> {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()
});

app.get('/order/:id', checkOrderId, showMethodAndUrl, (request, response)=> {
    const index = request.orderIndex

    return response.json(orders[index])
});

app.patch('/order/:id', checkOrderId, showMethodAndUrl, (request, response)=> {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order:orders[index].order, clientName:orders[index].clientName, price:orders[index].price, status: "Pronto"}

    orders[index] = updateOrder

    return response.json(updateOrder)
});


app.listen(port, () => {
    console.log(`✔ Server started on port ${port}`)
});