/**
 * App
 */
var almobile = angular.module('almobile',[]);

/**
 * Controller do App
 */
function TheController ($scope, $timeout) {
    var db  = new MySqlDB();
        db.init();
    
    /**
     * Inicia as configurações
     */
    $scope.init = function(){
        $scope.trava = false;
        $scope.wkflow = "disciplinas";
        $timeout($scope.refreshList, 400);
    };
    
    
    /**
     * Atualiza a lista de disciplinas
     */
    $scope.refreshList = function(){
        $scope.itens = [];
        db.listAll(function (err, value) {
            $scope.itens.push(value);
        });
        $timeout(list, 200);
        //Ainda não sei porque, mas o bind só acontece se eu fizer esse timeout
        function list() {
            console.log("OK");
        }
    }
    /**
     * Abre e fecha o menu do aplicativo
     */
    $scope.toggleMenu = function(){
        console.log(angular.element(document.querySelector( '#menu' )));
        if($scope.wkflow == "menu"){
            $scope.changeView("disciplinas");
        } else {
            $scope.changeView("menu");
        }
    };
    /**
     * Muda a visão atual
     */
    $scope.changeView = function(w){
        $scope.wkflow = w;
    };
    /**
     * Faz o Toggle da nota para o modo de edição
     */
    $scope.setNota = function(nota, id){
        elemsp = document.getElementById("sp"+nota+id);
        elemlb = document.getElementById("lb"+nota+id);
        elemip = document.getElementById("ip"+nota+id);
        
    	//Escondendo as boxes input.
		var elements = [];
		elements = document.getElementsByClassName("nota");
		for(i=0; i<elements.length;i++){
		     elements[i].style.display = "none";
		}
		if(elemsp.textContent == "OK" && document.activeElement.getAttribute("id") != "ip"+nota+id){
	    	elemsp.textContent = nota;
	    	elemsp.style.background = '#5A6A7A';
			elemlb.style.display = "inline-block";
			$scope.calcula();
            $scope.trava = false;
            db.save($scope.itens[id]);
		} else {
            if (!$scope.trava){
                prepVar(true);
                $scope.trava = true;
            }
	    	elemsp.textContent = "OK";
	    	elemsp.style.background = '#1CAF9A';	    	
			elemip.style.display = "inline-block";
			elemip.focus();
			elemlb.style.display = "none";
		}
    };
    
    /**
     * Adiciona uma nova disciplina
     */
    $scope.addItem = function(){
        if($scope.novadisc.length > 1) {
            var newItem = {
                    disciplina: $scope.novadisc, 
                    n1: {
                        value: 0,
                        calc: false,
                    }, 
                    n2:  {
                        value: 0,
                        calc: false,
                    }, 
                    n3:  {
                        value: 0,
                        calc: false,
                    },
                    n4:  {
                        value: 0,
                        calc: false,
                    },
                    status : ''
                };
            db.save(newItem, function(error, result){
                $scope.novadisc = "";
                $scope.itens.push(result);
                $timeout(list, 200);
                //Ainda não sei porque, mas o bind só acontece se eu fizer esse timeout
                function list() {
                    console.log("OK");
                }
            });
        }
    }
    
    
    /**
     * Mostra disciplina
     */
    $scope.show = function(id){
        var i=0,
        elms = document.querySelectorAll("#item"+id+" .subitems li");
        block = (elms[0].style.display == "block");
        
        elem = document.getElementById("item"+id);
    	if (elem.style.backgroundColor == "rgb(255, 245, 245)"){
    		elem.style.backgroundColor = '#A8A8A8';
    	} else {
    		elem.style.backgroundColor = '#FFF5F5';
    	}
         for(i=0;i<elms.length;i++) {
            elms[i].style.display = ((block) ? "none" : "block");
         }
    }
    
    /**
     * Deleta disciplina
     */
    $scope.delete = function(id, key){
    	//$scope.itens.splice(id,1);
        db.del(key, function(){
            $timeout($scope.refreshList, 200);
        });
    }
    
    /**
     * Calcula os valores das notas;
     */
    $scope.calcula = function(){
        prepVar();
		for(i=0; i<$scope.itens.length;i++){
			/*Soma N1 + N2 */
			var n12   = $scope.itens[i].n1.value + $scope.itens[i].n2.value,
				total = 0;

            /* Se o aluno informou N1*/
            if($scope.itens[i].n1.value > 0 && $scope.itens[i].n1.value < 10){
                /* Se o aluno informou N2*/
                if($scope.itens[i].n2.value > 0 && $scope.itens[i].n2.value < 10) {
                    /* Se o aluno reprovou direto*/
                    if(!(n12 > 6 && n12 <= 20)){
                        $scope.itens[i].status = "Reprovado";
                    } else{
                    /* Se o aluno não reprovou direto*/
                        $scope.itens[i].status = "";
                        /* Se o aluno passou direto*/
                        if(n12 >= 16){
                            $scope.itens[i].status = "Aprovado";
                        } else if($scope.itens[i].n3.value == 0) {
                        /* Se o aluno não fez N3*/
                            $scope.itens[i].n3.value = (18-(n12)).toFixed(2);
                            $scope.itens[i].n3.calc = 1;
                            $scope.itens[i].status = "Não desanime, a N3 te espera";
                            if ($scope.itens[i].n3.value > 10) {
                                $scope.itens[i].n3.value = (10).toFixed(2);
                                total = n12+10;
                                console.log(total);
                                $scope.itens[i].n4.value = (12 -(total/3)).toFixed(2);
                                $scope.itens[i].n4.calc = 1;
                                $scope.itens[i].status = "Estude! Você não escapa da N4";
                            }
                        } else if($scope.itens[i].n3.value >0 && $scope.itens[i].n3.value < 10) {
                        /* Se o aluno já fez N3*/
                            total = n12+$scope.itens[i].n3.value;
                            if(total >=18) {
                                $scope.itens[i].status = "Aprovado";
                            } else if($scope.itens[i].n4.value > 0) {
                        /* Se o aluno já fez N4*/
                                total = (((total/3)+$scope.itens[i].n4.value)/2).toFixed(2);
                                if(total > 6) {
                                    $scope.itens[i].status = "Aprovado";
                                } else {
                                    $scope.itens[i].status = "Reprovado";
                                }
                            } else {
                        /* Se o aluno não fez N4*/
                                $scope.itens[i].n4.value = (12 -(total/3)).toFixed(2);
                                $scope.itens[i].n4.calc = 1;
                                $scope.itens[i].status = "Estude! Você não escapa da N4";
                            }
                        }
                    }
                } else {
                /* Se o aluno não informou N2*/
                    $scope.itens[i].n4.value = 0;
                    $scope.itens[i].n3.value = 0;
                    $scope.itens[i].n2.value = (16 - $scope.itens[i].n1.value).toFixed(2);
                    $scope.itens[i].n2.calc = 1;
                    if ($scope.itens[i].n2.value > 10) {
                        $scope.itens[i].n3.value = ($scope.itens[i].n2.value - 8).toFixed(2);
                        $scope.itens[i].n3.calc = 1;
                        $scope.itens[i].n2.value = (10).toFixed(2);
                        $scope.itens[i].status = "Não desanime, a N3 te espera";
                    }
                }
            }
		}
        prepVar(false,true);
    }
    /**
     * Prepara as notas para edição ou cálculo
     */
    var prepVar = function(limpa,fixa){
        /*Preparando variáveis*/
        for(i=0; i<$scope.itens.length;i++){
            for (j=1;j<5;j++){
                if($scope.itens[i]['n'+j].calc && limpa){
                    $scope.itens[i]['n'+j].value = 0;
                    $scope.itens[i]['n'+j].calc = 0;
                } else {
                    if(fixa){
                        $scope.itens[i]['n'+j].value = isNaN(parseFloat($scope.itens[i]['n'+j].value)) ? 0 : parseFloat($scope.itens[i]['n'+j].value).toFixed(2);
                    } else {
                        $scope.itens[i]['n'+j].value = isNaN(parseFloat($scope.itens[i]['n'+j].value)) ? 0 : parseFloat($scope.itens[i]['n'+j].value);
                    }
                }
            }
        }
    };
}
