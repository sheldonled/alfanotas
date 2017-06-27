module.exports = function(lang) {
    switch(lang) {
        case "pt_br":
            const msgs = {
                approved: "Passou!",
                reproved: "Reprovado!",
                needsN3: "Volte para os livros, você vai para N3!",
                needsN4: "Não entre em pânico, mas você vai para N4!",
                subjAlreadyExists: "A matéria %s já existe",
                subjAdded: "Matéria %s adicionada",
                subjDeleted: "Matéria %s deletada",
                subjNotDeleted: "Erro ao deletar matéria %s"
            };
            msgs.compose = (msg,piece) => msgs[msg].replace(/%s/ig,piece);
            return msgs;
    }
};