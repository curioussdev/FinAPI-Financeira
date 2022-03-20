const { response } = require('express');
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

 function getBalance(statement){
    const balance = statement.reduce((acc, operation)=>{ //acc é a variável responsável por ir armazenando ou removendo de dentro od obj
        if(operation.type === 'credit'){
            return acc + operation.amount;
        }else{
            acc - operation.amount;
        }

    }, 0);
    return balance;
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

 app.post("/withdraw", verifyIfExistsAccountCPF, (request, response)=>{
    const { amount } = request.body // recebendo a quantia que a gente quer fazer o saque 
    const { customer } = request;

    const balance = getBalance(customer.statement); // faz o balanço od estrato do customer

    if(balance < amount){
        return response.status(400).json({error: "insufficiente funds"})
    };

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation) // adicionando a statementOperation no statement do customer

    return response.status(201).send({message: "Saque realizado com sucesso"})
 });

 app.get("/statement/date", verifyIfExistsAccountCPF, (request, response)=>{
    
    const { customer } = request; // reqcuperando do request com as informações inseridas
    const { date } = request.query;
    const dateFormat = new Date(date + " 00:00");

    // 19/10/2022 transforma a data do date em data organizada
    const statement = customer.statement.filter(
        (statement)=>statement.created_at.toDateString() === 
        new Date(dateFormat).toDateString());

    return response.json(statement)
 });

 app.put("/account", verifyIfExistsAccountCPF, (request, response)=>{
     const { name } = request.body;
     const { customer } = request;

     customer.name = name;
     return response.status(201).send({message: "Customer Updated!"})
 })

app.listen(3000);
 