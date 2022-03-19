const express = require('express');
const { v4: uuidv4 }  = require("uuid") // o v4, gera IDs aleatórios

const app = express();
app.use(express.json()) //middleware

const customers = [];

 //Middlewer

 app.post("/account", (request, response)=>{
     const { cpf, name } = request.body;

     const customerAlreadyExists = customers.some( // verificando se existe user com o mesmo cpf
         (customer) => customer.cpf === cpf
     );
     if(customerAlreadyExists){
         return response.status(400).json({error: "Customer Already Exists!"})
     }

     customers.push({
         cpf,
         name,
         id: uuidv4(),
         statement: []
     });

     return response.status(201).send({message: "Customer Created!"})
 })

 app.get("/statement", (request, response)=>{
    const { cpf } = request.headers; // buscar o cpf usando o destructing

    const customer = customers.find(
        (customer) => customer.cpf === cpf) //procura algum customer igual ao cpf que foi passado 
        
        if(!customer){
            return response.status(400).json({error: "Customer not found!"})
        }

        return response.json(customer.statement)
 })

app.listen(3000);
