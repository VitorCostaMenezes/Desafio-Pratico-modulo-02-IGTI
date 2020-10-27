function media(array) {
    const sum = soma(array);
    const media = sum / array.length;
    return media;
}



function soma(array) {
    const sum = array.reduce((previousValue, currentValue) => {
        return previousValue + currentValue;
    }, 0);
    return sum;
}

//exportação default na sua chamada é necessário atribuir um nome qualquer ex:  import cal from "..libs/calculos.js"
//na utilização vc tem que usar o calc na frente da função, ex:   calc.media()   calc.soma()
//ou usar um destruct e usar o nome diretamente   exe:    const {media, soma} = calc
//e na hora usar o somente o nome   media()        soma()
export default {media, soma};