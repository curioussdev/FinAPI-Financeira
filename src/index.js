const express = require('express');
const { v4: uuidv4 }  = require("uuid") // o v4, gera IDs aleatórios

const app = express();
app.use(express.json())

const costomers = []

 //Middlewer
 function verifyIfExistsAccountCPF(request, response, next){
    const { cpf } = request.headers;

    const costomer = costomers.find(costomer => costomer.cpf === cpf);

        if(!costomer){
            return response.status(400).json({error: "Customer not found!"})
        };
    
    request.costomer = costomer;

    return next();
 }


    app.post("/account", (request, response)=>{ //Cadastrar User
        const { cpf, name} = request.body;

        const costomerAlreadyExits = costomers.some(
            (costomers) => costomers.cpf === cpf // Percorre e compara o cpf e verifica se existe um igual. Se não existir um cpf, vai permitir o cadastro de uma nova conta
        );

        if(costomerAlreadyExits){ // caso ouver um cpf igual a um já cadastrado, retorna error
            return response.status(400).json({error: "Costomer Already Exists!"})
        }

        costomers.push({
            cpf,
            name,
            id: uuidv4(),
            statement: [
                
            ]
        })

    return response.status(201).send()
    });

    app.get("/statement", verifyIfExistsAccountCPF, (request, response)=>{
        
        const { costomer } = request;        

        return response.json(costomer.statement);
    });

    app.post("/deposit", verifyIfExistsAccountCPF, (request, response) =>{
        
    }) 


app.listen(3000);
