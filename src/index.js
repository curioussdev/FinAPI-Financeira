const express = require('express');
const { v4: uuidv4 }  = require("uuid") // o v4, gera IDs aleatórios

const app = express();
app.use(express.json())

const costomers = []
/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - []
 */

app.post("/account", (request, response)=>{
    const { cpf, name} = request.body;

    const costomerAlreadyExits = costomers.some(
        (costomers) => costomers.cpf === cpf // Percorre e compara o cpf e verifica se existe um igual. Se não existir um cpf, vai permitir o cadastro de uma nova conta
    );

    if(costomerAlreadyExits){ // caso ouver um cpf igual a um já cadastrado, retorna error
        return response.status(400).json({error: "Costomer Already Exists!"})
    }


    const id = uuidv4();


    costomers.push({
        cpf,
        name,
        id,
        statement: [

        ]
    })

    return response.status(201).send()
})




app.listen(3000);
