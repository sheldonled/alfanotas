Alfanotas
=========
Alfanotas is a webapplication built in 2014 to practice Web Mobile Development. It was rebuilt from scratch in 2017 again for practice.

It stores the grads of a student at UniAlfa(Goiania) and says if they'll need a retake test

## Summary
1. [Descrição em Português](#descrição-em-português)
2. [Technical Notes](#technical-notes)
3. [TODO](#todo)

## Descrição em Português

Alfa Notas é um aplicativo que facilita o cálculo de média para alunos da UniAlfa (Faculdades Alfa - Goiania).

### Introdução

Existem 4 momentos de avaliação durante um período/semestre na UniAlfa: N1,N2,N3 e N4. A N1 e N2 são as obrigatórias e compostas por um teste formal que vale 8 dos 10 pontos e os outros 2 pontos são a avaliação processual, que pode ser tarefa de casa, seminários ou qualquer coisa que o professor decidir.

Se o aluno conseguir média 8 na N1 e N2, ele já é aprovado nessa matéria. Se tiver média menor que 3 é reprovado diretamente. Se nenhuma dessas ocasiões ocorrerem o aluno precisará fazer N3.

A N3 não é uma recuperação ainda, mas se o aluno não conseguir média 6.0 nessas 3 provas ele precisará fazer N4. A N3 e N4 são apenas uma prova comum, valendo 0 a 10. A média para aprovacação é 6.0 e as regras de cálculo são as seguintes:

### Regras

1. (N1+N2)/2 : {se menor ou igual a 3 == **reprovado**; Se maior ou igual a 8 == **aprovado**; Se entre 3 e 8, fará N3; }
2. (N1+N2+N3)/3 : { Se maior ou igual a 6 == **aprovado**; Se menor que 6, fará N4; }
3. { [(N1+N2+N3)/3] + N4 }/2 : { Se maior ou igual a 6 == **aprovado**; Se menor que 12 == **reprovado** }

Apesar de serem contas simples, pode ser confuso para muitas pessoas, por isso o aplicativo tem bastante aceitação.

## Technical Notes

To run this app the only thing you need to do is download this repository and open the index.html file on any good browser (I didn't test it on IE).

If you want to take a look in the code and change it, you need to setup some things. Thankfully, everything is inside the package.json file and you need to run only 1 command:
```
npm install
```

After the changes, you need to run:
```
npm run build
```

And this is pretty much it 😉

Maybe you'll need to install something else, but it'll depend on how much things you already have in your computer.

## TODO
- [x] Get rid of bower
- [x] Make alerts disappear after a while
- [ ] Improve code style
- [ ] Replace JSHint with ESLint
- [ ] Add more alerts to comunicate better with the user
- [ ] Cover all functions with unit tests
- [ ] Implement Service Workers