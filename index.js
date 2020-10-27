import express from "express";
import { promises as fs } from "fs";//importando a biblioteca file system em formato de promises
import lancamentosRouter from "./routes/lancamentos.js"; //importando as rotas do arquivo lançamentos



const { readFile } = fs;


const app = express();
app.use(express.json());




//criando uma variavel global para não precisar ficar repetindo   "lacamentos.json" varias vezes
global.fileName = "grades.json";

//tudo que chegar em /lançamentos vai ser passado para o arquiovo lacamentos.js
 app.use("/lancamentos", lancamentosRouter);

 app.use("/lancamentos/media", lancamentosRouter);




app.listen(3000, async () => {

    try {
        await readFile(global.fileName);

        console.log("API Started!");//foi usado para testar se o servidor estava sendo iniciado

    } catch (err) {
        res.status(400).send(err.message);

    }
});
 



