const express = require('express');
const { v4: uuidv4 }  = require("uuid"); // o v4, gera IDs aleatórios

const app = express();
app.use(express.json()) //middleware

const customers = [];

 //Middleware
 function verifyIfExistsAccountCPF(request, response, next){
    const { cpf } = request.headers; // buscar o cpf usando o destructing

    const customer = customers.find(
        (customer) => customer.cpf === cpf) //procura algum customer igual ao cpf que foi passado 
        
        
        if(!customer){
            return response.status(400).json({error: "Customer not found!"})
        }

    request.customer = customer; // inserindo informação dentro do request

    return next();
 }

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

 app.get("/statement", verifyIfExistsAccountCPF, (request, response)=>{
    
    const { customer } = request; // reqcuperando o request com as informações inseridas
    return response.json(customer.statement)
 });

 app.post("/deposit", verifyIfExistsAccountCPF, (request, response)=>{
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation) // inserindo as informações de depósito no statement

    return response.status(201).send({message: "Depósito realizado com sucesso!"});
 });

app.listen(3000);
