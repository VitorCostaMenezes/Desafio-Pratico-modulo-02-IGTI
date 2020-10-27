import express from "express";
import { promises as fs} from "fs";//importando a biblioteca file system
// import calc from "../libs/calculos.js";


const { readFile, writeFile } = fs;

const router = express.Router();

router.use(express.json());

//metodo de inserção
router.post("/inserir", async (req, res, next) => {
    try {
            let grade = req.body; //pegando o valor que vem pelo corpo do body em formato json 
              //iniciando a leitura do arquivo

            //validando as informações recebidas
            //como é possivel inserir 0 no balanace, foi necessário inserir o == null 
            //para que não ocorra problema quando o valor inserido for igual a zero

            // if (grade.student || grade.subject || grade.type || !grade.value == null ){
            //     throw new Error("Todos os campos são obrigatórios")
            // }
            const data = JSON.parse(await readFile(global.fileName));
            //vai reinserir na variavel o conteudo anterior
            //neste caso o comando vai inserir no array apenas o que for necessárrio
            grade = {
                id: data.nextId++,//depois incremneta para quando ocorrer a proxima iteração
                student: grade.student,
                subject: grade.subject,
                type: grade.type,
                value: grade.value,
                timestamp: new Date()
            }
            //reatribuindo o valor anterior da propria variavel eaplhando-a após a inserção de novos elementos no incio do array
            // account = {id: data.nextId,  ...account};
            //inseridno ID em cada elemento
            //ele pega o id setado incialmente como 1 e atribui seu valor em account.id
           // account.id = data.nextId;//compara com o id setado anteriormente
            data.grades.push(grade); //salvando no array 
            //salvando em arquivo
            await writeFile(global.fileName, JSON.stringify(data, null, 2));
            res.send(grade);

   } catch (err) { 
        //  res.status(400).send(err.message);
         next(err);//pulando pra funçãod e tratamento gebnerico no final
   }
} );

//metodo de atualização
router.put("/update", async (req, res, next) => {
    try {
       const grade =   req.body;
    //    //validando as entradas
    //    if (!grade.id || grade.name || grade.student || grade.subject || grade.type || !grade.value == null ){
    //     throw new Error("Necessário prencher todos os campos para atualizar!")
    //     }
        const data = JSON.parse(await readFile(global.fileName));
        //o find idnex em vez de retornar o elemento inteiro retorna apenas o indice
        const index = data.grades.findIndex(a => a.id === grade.id) //coparando qual id da conta é igual ao que esta sendo passado

        //validando a entrada
        if (index === -1) {
            throw new Error("Registro não encontrado"); //joga o erro pra fenete através do catch
        }
        //substituindo a propriedade name deste indice  pelo conteudo name passado pelo body
       data.grades[index].student = grade.student;
       data.grades[index].subject = grade.subject;
       data.grades[index].type = grade.type;
       data.grades[index].value = grade.value;
       data.grades[index].timestamp = new Date();

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(grade);

    } catch(err) {
        next(err);
    }
});


//implementando o metodo delete
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        //neste exemplo o filter e repassa uma array com todos os elementos que são diferentes da lógica aplicada
        //subsecrevendo o proprio arquivo que foi lido com todos os elementos, exceto o que foi pesquisado
        data.grades = data.grades.filter( grade => grade.id !== parseInt(req.params.id));
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send("Arquivo deletado com sucesso!");

    }catch(err) {
        next(err);//pulando pra funçãod e tratamento gebnerico no final
    }

})


//filtrando um arquivo pelo id
router.get("/filtro/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
         //como  a url retorna uma string, e o Id estava salvo em forma de int
         // foi necessário converter para int para uma melhor comparação
        //utilizar apenas dois sinais de igual ==   tambem resolveria a situação
        const grade =   data.grades.find(grade =>grade.id === parseInt(req.params.id));
        
        res.send(grade);

    } catch(err){
        next(err);//pulando pra funçãod e tratamento gebnerico no final

    }
});

//consultar a nota total de um aluno em uma disciplina:
//deve-se inserir dois parâmetros
// student     e      subject
//acessar pelo exemplo de URL abaixo
//  http://localhost:3000/lancamentos?student=Roberta Arcoverde&subject=01 - JavaScript

router.get("/notaTotal/:student/:subject", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        // const grade =  await data.grades.filter(grade => grade.student === req.query.student && grade.subject === req.query.subject);
        const grade =  await data.grades.filter(grade => grade.student === req.params.student && grade.subject === req.params.subject);
        const notas = grade.reduce((acc, cur) => {
            return acc + cur.value;
        }, 0);
        
        res.send(JSON.stringify(`A soma das notas de ${req.params.student} na disciplina: ${req.params.subject}.  É igual a: ${notas}`));
    //     const cont = [];
    //     grade.forEach(item => {
    //         cont.push(item.value)
    //         });
    //     let contador = 0 
    //     for (let i=0; i < cont.length; i++){
    //         contador = contador + cont[i];
    //     }
    //   res.send(JSON.stringify(contador));
    } catch(err){
        next(err);//pulando pra funçãod e tratamento gebnerico no final
    }
});



//imprime a media das subjects relacionadas aos types
router.get("/media/:subject/:type", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const grade =  await data.grades.filter(grade => grade.subject === req.params.subject && grade.type === req.params.type );

        const notas = grade.reduce((acc, cur) => {
            return acc + cur.value;
        }, 0);
        
        const media = notas / grade.length;

        res.send(JSON.stringify(`A média  do subject: ${req.params.subject}, e type: ${req.params.type}.  É igual a: ${media}`));
    
    } catch(err){
        next(err);//pulando pra funçãod e tratamento gebnerico no final
    }
});


//busca os três melhores de cada subject associado ao type
router.get("/tresMelhores/:subject/:type", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const grade =  await data.grades.filter(grade => grade.subject === req.params.subject && grade.type === req.params.type );

        grade.sort((a , b )=> {
            return b.value - a.value;
         });

         const filtro = grade.slice(0, 3)

        res.send( filtro);
    
    } catch(err){
        next(err);//pulando pra funçãod e tratamento gebnerico no final
    }
});


//filtrando e somando notas
// router.get("/:student", async (req, res, next) => {
//     try {

//         const data = JSON.parse(await readFile(global.fileName));

//         const student = req.params.student;
        
         
//         const grade =  data.grades.filter((item) => item.student ===  student);
        
//         // const notas = grade.reduce((acc, cur) => {
//         //     return acc + cur.value;
//         // }, 0);

//         res.send(grade);
        
//     } catch(err){
//         next(err);//pulando pra funçãod e tratamento gebnerico no final
//     }
// })

router.use( (err, req, res, next) => {
     console.log(err);
      res.status(400).send({ error: err.message});
 
 } )
  


export default router;