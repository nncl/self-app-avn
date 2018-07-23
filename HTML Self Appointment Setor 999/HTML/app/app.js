'use strict';

angular.module('formSelf', ['ngAnimate', 'ui.mask', 'ngFileUpload']).

controller('formCtrl', ['$scope', '$http', '$filter', 'Upload', function($scope, $http, $httpProvider, $filter, Upload) {

  /* ============== Nomeação dos scopes padrões */
  
  $scope.numero_proposta = "";

  $scope.formParams = {};
  /*$scope.estados = [
      {
        "nome": 'AC'
      },

      {
        "nome": 'AL'
      },

      {
        "nome": 'AP'
      },

      {
        "nome": 'AM'
      },

      {
        "nome": 'BA'
      },

      {
        "nome": 'CE'
      },

      {
        "nome": 'DF'
      },

      {
        "nome": 'ES'
      },

      {
        "nome": 'GO'
      },

      {
        "nome": 'MA'
      },

      {
        "nome": 'MT'
      },

      {
        "nome": 'MS'
      },

      {
        "nome": 'MG'
      },

      {
        "nome": 'PA'
      },

      {
        "nome": 'PB'
      },

      {
        "nome": 'PR'
      },

      {
        "nome": 'PE'
      },

      {
        "nome": 'PI'
      },

      {
        "nome": 'RJ'
      },

      {
        "nome": 'RN'
      },

      {
        "nome": 'RS'
      },

      {
        "nome": 'RO'
      },

      {
        "nome": 'RR'
      },

      {
        "nome": 'SC'
      },

      {
        "nome": 'SP'
      },

      {
        "nome": 'SE'
      },

      {
        "nome": 'TO'
      }
  ]*/

  $scope.stage = "";
  $scope.formValidation = false;
  $scope.validcep = true;
  $scope.validcepentrega = true;
  $scope.showLoading = false;

  $scope.setorEVA = 999;
  $scope.regEVA = 99999999;

  $scope.idade = '';
  
  $scope.formParams = {

    st1_cpf: '',
    st1_nome: '',
    st1_celular: '',
    st1_telefone: '',
    st1_email: '',
    st1_confirm_email: '',
    st1_nasc_date: '',
    st1_termos: '',
    st1_voltagem: '',

    endereco: {

      st2_cep: '',
	    st2_logradouro: '',
      st2_endereco: '',
      st2_numero: '',
      st2_complemento: '',
      st2_ponto_referencia: '',
      st2_bairro: '',
      st2_cidade: '',
      st2_estado: ''

    },

    st2_check_endereco_entrega: '',

    endereco_entrega: {

      st2_cep: '',
	    st2_logradouro: '',
      st2_endereco: '',
      st2_numero: '',
      st2_complemento: '',
      st2_ponto_referencia: '',
      st2_bairro: '',
      st2_cidade: '',
      st2_estado: ''

    },

    registro_indicante: ''

  };

  $scope.json_arquivos = [];

  /* Arquivos */

  $scope.file_foto = '';

  $scope.file_residencia = '';

  $scope.file_identificacao1 = '';
  $scope.file_identificacao2 = '';

  $scope.file_cpf = '';

  $scope.file_emancipacao = '';
	$scope.mensagem = '';

	$scope.formatNome = function (source) {
                var accent = [
                        /[\300-\306]/g, /[\340-\346]/g, // A, a
                        /[\310-\313]/g, /[\350-\353]/g, // E, e
                        /[\314-\317]/g, /[\354-\357]/g, // I, i
                        /[\322-\330]/g, /[\362-\370]/g, // O, o
                        /[\331-\334]/g, /[\371-\374]/g, // U, u
                        /[\321]/g, /[\361]/g, // N, n
                        /[\307]/g, /[\347]/g  // C, c
                    ],
                    noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

                for (var i = 0; i < accent.length; i++) {
                    source = source.replace(accent[i], noaccent[i]);
                }
                return source;
            };
	
	$scope.validaPeso = function(foto){
    if(foto >= 1000 || foto != null){
      console.log('teste');
      console.log(foto);
    }else{console.log(foto)}
  };
	
  /* ============== Função referente ao envio dos arquivos e alteração dos escopos */
  $scope.uploadArquivo = function( tipo, arquivo) {

    switch(tipo){

      case 'foto':

        $scope.file_foto = arquivo;
        if( $scope.file_foto != null ){
          $scope.file_foto.tamanho = formatFileSize(arquivo.size, 3);  
        }
          
      break;

      case 'residencia':

        $scope.file_residencia = arquivo;
        if( $scope.file_residencia != null ){
          $scope.file_residencia.tamanho = formatFileSize(arquivo.size, 3);
        }

      break;

      case 'identificacao':

        if($scope.file_identificacao1 == '' || $scope.file_identificacao1 == null) {
          $scope.file_identificacao1 = arquivo;
          if( $scope.file_identificacao1 != null ){
            $scope.file_identificacao1.tamanho = formatFileSize(arquivo.size, 3);
          }
        } else if($scope.file_identificacao1 != '' && arquivo != null) {
          $scope.file_identificacao2 = arquivo;
          if( $scope.file_identificacao2 != null ){
            $scope.file_identificacao2.tamanho = formatFileSize(arquivo.size, 3);
          }
        }

      break;

      case 'cpf':

        $scope.file_cpf = arquivo;
        if( $scope.file_cpf != null ){
          $scope.file_cpf.tamanho = formatFileSize(arquivo.size, 3);
        }

      break;

      case 'emancipacao':

        $scope.file_emancipacao = arquivo;
        if( $scope.file_emancipacao != null ){
          $scope.file_emancipacao.tamanho = formatFileSize(arquivo.size, 3);
        }

      break;

      default:

        $scope.file.name= "Nenhum arquivo selecionado";
        $scope.file.tamanho = 0;

      break;


    }

  };

  $scope.removeFile = function(fileN){
	  //$scope.fileN = '';
	  $scope.file_foto = '';
	  console.log("fileN, ", fileN);
	  console.log("file_foto, ", $scope.file_foto);
  };
  
  /* ============== Função http para pesquisa dos dados do endereço */
  $scope.buscarCep = function ( tipo, obj_end ) {

    var url = "https://pco-cornerstone.serasaexperian.com.br/avon/v1?workflow=AnaliseCadastral";

    var ddd = $scope.formParams.st1_celular.substring(0, 2);
    var telefone = $scope.formParams.st1_celular.substring(2);

    var ddd_alternativo = $scope.formParams.st1_telefone.substring(0, 2);
    var telefone_alternativo = $scope.formParams.st1_telefone.substring(2);

    var parameter = {
      "proposta": {
        "origem": "SELF APPT",
        "selfAppointment": "3123123312",
        "numeroProposta": $scope.numero_proposta,
        "token": "selfAppointment",
        "TipoServico": "CEP",
        "email": $scope.formParams.st1_email,
        "celular": {
          "ddd": ddd, 
          "telefone": telefone
        },
        "enderecoCobranca": {
          "cep": $scope.formParams.endereco.st2_cep,
          "FlagCEP":"1"
        },
        "alternativo": {
          "ddd": ddd_alternativo,
          "telefone": telefone_alternativo
        }
      }
    };

    if($scope.formParams.st2_check_endereco_entrega == 1) {

      parameter['proposta']["enderecoEntrega"] = {
        "cep": $scope.formParams.endereco_entrega.st2_cep,
        "FlagCEP":"1"
      };

    }; /*else {

      parameter['proposta']["enderecoEntrega"] = { //cobranca
        "cep": $scope.formParams.endereco.st2_cep,
        "FlagCEP":"1"
      };

    }*/

    $http({
      method: 'POST',
      url: url,
      data: parameter,
      headers: {
        "Content-Type": "text/plain"
      },
    }).then(function(response) {

      $scope.validcep = true;
      $scope.validcepentrega = true;

      /* Verifica se o sistema retornou um CEP valido */

      var dados = response.data.data.proposta;

      var endereco_cobranca = dados.enderecoCobranca;
      var endereco_entrega = dados.enderecoEntrega;

	    $scope.formParams.endereco.st2_logradouro = endereco_cobranca.tipoLogradouro;
      $scope.formParams.endereco.st2_endereco = endereco_cobranca.logradouro;
      $scope.formParams.endereco.st2_bairro = endereco_cobranca.bairro;
      $scope.formParams.endereco.st2_cidade = endereco_cobranca.cidade;
      $scope.formParams.endereco.st2_estado = endereco_cobranca.uf;

      if($scope.formParams.st2_check_endereco_entrega == 1) {

		    $scope.formParams.endereco_entrega.st2_logradouro = endereco_entrega.tipoLogradouro;
        $scope.formParams.endereco_entrega.st2_endereco = endereco_entrega.logradouro;
        $scope.formParams.endereco_entrega.st2_bairro = endereco_entrega.bairro;
        $scope.formParams.endereco_entrega.st2_cidade = endereco_entrega.cidade;
        $scope.formParams.endereco_entrega.st2_estado = endereco_entrega.uf;

      }

      /* Testa se a função retornou os dados para desbloquear os campos */
      if( endereco_cobranca.logradouro == undefined) {
        $scope.validcep = false;
      }

      if( endereco_entrega.logradouro == undefined) {
        $scope.validcepentrega = false;
      }
        $scope.estados = dados.enderecoCobranca.uf; //fazer uum get
        //console.log($scope.estados);
    });

  }


  /* ============== Validação e requisição do serviço de CPF */
  $scope.validCPF = function ( cpf ) {

    if(!checkCPF(cpf)) {
      $scope.formPrincipal.cpf.$setValidity("validador", false);
    } else {

      $scope.formPrincipal.cpf.$setValidity("validador", true);

      var url = "https://pco-cornerstone.serasaexperian.com.br/avon/v1?workflow=AnaliseCadastral";

      var parameter = JSON.stringify(
        {
          "proposta": {
            "origem": "SELF APPT",
            "selfAppointment": "3123123312",
            "cpf": cpf,
            "TipoServico": "CPF",
            "setorEVA": $scope.setorEVA,
            "regAscEVA": $scope.regEVA
          }
        }
      );

      $http({
          method: 'POST',
          url: url,
          data: parameter,
          headers: {
              "Content-Type": "text/plain"
          },
      }).then(function(response) {

        var dados = response.data;
        var dados_proposta = dados.data.proposta;

        //console.log(dados.data.uf);
        
        /* Retorna erro referente ao cpf */
        if(dados.status > 2) {

          $scope.formPrincipal.cpf.$setValidity("validador", false);
          showModal( 'Ocorreu um erro!', 'Ops! Encontramos um erro. Favor entrar em contato com 0800 9407373.');
          $scope.cleanFields();
        } else {

          /* Pega o dado de valor da proposta */
          $scope.numero_proposta = dados_proposta.numeroProposta;

        }

      });

    }

  }

  /* ============== Validação e requisição do serviço de CPF */
  $scope.validDate = function ( date ) {

    $scope.idade = getIdade( date );
	  
	checkDate( date );
		  
    if( $scope.idade == 0 ) {
      $scope.formPrincipal.data_nascimento.$setValidity("validador", false);
    } else {
      $scope.formPrincipal.data_nascimento.$setValidity("validador", true);
    }

  }
  
  /* ============== Limpar os campos do primeiro passo */
  $scope.cleanFields = function () {

    $scope.formParams.st1_cpf = '';
    $scope.formParams.st1_nome = '';
    $scope.formParams.st1_celular = '';
    $scope.formParams.st1_telefone = '';
    $scope.formParams.st1_email = '';
    $scope.formParams.st1_confirm_email = '';
    $scope.formParams.st1_nasc_date = '';
    $scope.formParams.st1_termos = '';

  }

  /* ============== Função padrão para validação e passagem de passo */
  $scope.next = function (stage) {
    
    $scope.formValidation = true;
    
    if ($scope.formPrincipal.$valid) {
      $scope.direction = 1;
      $scope.stage = stage;
      $scope.formValidation = false;

    }

  };


  /* ============== Função padrão para validação e passagem de passo para a área de arquivos */
  $scope.nextFile = function () {

    $scope.formValidation = true;

    /* Monta o json de arquivos */

    var valid = true;

    if( $scope.file_foto == '' ) {

      valid = false;

    } else {

      /* Cria o registro do arquivo no json de envio */
      getBase64($scope.file_foto, function(e) {
        var base64 = e.target.result.split(',').pop();

        //console.log(base64);
        
        //base64.replace("data:image/jpeg;base64,", "");
        //base64.replace("data:image/png;base64,", "");
        //base64.replace("data:image/gif;base64,", "");
        //base64.replace("data:image/bmp;base64,", "");
       
        $scope.json_arquivos.push({
          "tipoImagem": "1",
          "base64": base64
        });

      });

    }

    if( $scope.file_residencia == '' ) {
      valid = false;
    } else {

      /* Cria o registro do arquivo no json de envio */
      getBase64($scope.file_residencia, function(e) {
        var base64 = e.target.result.split(',').pop();
        //var base64 = e.target.result.split("data:image/jpeg;base64,").pop();

        $scope.json_arquivos.push({
          "tipoImagem": "4",
          "base64": base64
        });

      });

    }

    if( $scope.file_identificacao1 != '') {

      /* Cria o registro do arquivo no json de envio */
      getBase64($scope.file_identificacao1, function(e) {
        var base64 = e.target.result.split(',').pop();
        //var base64 = e.target.result.split("data:image/jpeg;base64,").pop();

        $scope.json_arquivos.push({
          "tipoImagem": "2",
          "base64": base64
        });

      });

    }

    if( $scope.file_identificacao2 != '') {

      /* Cria o registro do arquivo no json de envio */
      getBase64($scope.file_identificacao2, function(e) {
        var base64 = e.target.result.split(',').pop();
        //var base64 = e.target.result.split("data:image/jpeg;base64,").pop();

        $scope.json_arquivos.push({
          "tipoImagem": "3",
          "base64": base64
        });

      });

    }

    if( $scope.file_identificacao1 == '' && $scope.file_identificacao2 ) {
      valid = false;
    }

    if( $scope.file_cpf != '' ) {

      /* Cria o registro do arquivo no json de envio */
      getBase64($scope.file_cpf, function(e) {
        var base64 = e.target.result.split(',').pop();
        //var base64 = e.target.result.split("data:image/jpeg;base64,").pop();

        $scope.json_arquivos.push({
          "tipoImagem": "6",
          "base64": base64
        });

      });

    }

    if( $scope.file_emancipacao == '' && $scope.idade < 18 ) {
      valid = false;
    } else if( $scope.file_emancipacao != '' && $scope.idade < 18 ) {

      /* Cria o registro do arquivo no json de envio */
      getBase64($scope.file_emancipacao, function(e) {
        var base64 = e.target.result.split(',').pop();
        //var base64 = e.target.result.split("data:image/jpeg;base64,").pop();

        $scope.json_arquivos.push({
          "tipoImagem": "5",
          "base64": base64
        });

      });

    }

    if(valid) {
      $scope.direction = 1;
      $scope.stage = 'stage3';
      $scope.formValidation = false;
    }

  };

  /* ============== Voltar para o passo anterior */
  $scope.back = function (stage) {

    $scope.direction = 0;
    $scope.stage = stage;

  };
  
  /* ============== Função para submeter o form */
  $scope.submitForm = function () {

    // Checa a validade do form
    if ($scope.formPrincipal.$valid) {

      $scope.formValidation = false;

      var url = "https://pco-cornerstone.serasaexperian.com.br/avon/v1?workflow=AnaliseCadastral";
      var parameter = $scope.getSendParameter();

      console.log(parameter);

      $scope.showLoading = true;

      $http({
        method: 'POST',
        url: url,
        data: parameter,
        headers: {
          //"Content-Type": "text/plain"
          "Content-Type": "text/plain; charset=UTF-8\r\n"
        },
      }).then(function(response) {

        $scope.showLoading = false;
        console.log(response);

        /* Envia para a página de sucesso */
        $scope.next('stage4');

      });

    }

  };

  $scope.getSendParameter = function () {

    var ddd = $scope.formParams.st1_celular.substring(0, 2);
    var telefone = $scope.formParams.st1_celular.substring(2);

    var ddd_alternativo = $scope.formParams.st1_telefone.substring(0, 2);
    var telefone_alternativo = $scope.formParams.st1_telefone.substring(2);

    var endereco_entrega = {};
//aqui
    if($scope.formParams.st2_check_endereco_entrega == 1) {
      endereco_entrega = $scope.formParams.endereco_entrega;
    } /*else {
      endereco_entrega = $scope.formParams.endereco;
    }*/

    var dt = $scope.formParams.st1_nasc_date.split("/");
    var data_nascimento = dt[2]+dt[1]+dt[0];

    var json = {  
      "proposta":{
        "origem": "SELF APPT",
        "selfAppointment": "3123123312",
        "TipoServico":"AnaliseV2",
        "alternativo":{  
           "ddd": ddd_alternativo,
           "telefone": telefone_alternativo
        },
        "celular":{  
           "ddd": ddd,
           "telefone": telefone
        },
        "cpf": $scope.formParams.st1_cpf,
        "dataNascimento": data_nascimento,
        "email": $scope.formParams.st1_email,

        "enderecoCobranca":{  
           "FlagCEP":"1",
           "bairro": $scope.formParams.endereco.st2_bairro,
           "cep": $scope.formParams.endereco.st2_cep,
           "cidade": $scope.formParams.endereco.st2_cidade,
           "complemento": $scope.formParams.endereco.st2_complemento,
           "tipoLogradouro":$scope.formParams.endereco.st2_logradouro,
		       "logradouro": $scope.formParams.endereco.st2_endereco,
           "numero": $scope.formParams.endereco.st2_numero,
           "referencia": $scope.formParams.endereco.st2_ponto_referencia,
           "uf": $scope.formParams.endereco.st2_estado
        },
        "enderecoEntrega":{  
           "FlagCEP":"1",
           "bairro": endereco_entrega.st2_bairro,
           "cep": endereco_entrega.st2_cep,
           "cidade": endereco_entrega.st2_cidade,
           "complemento": endereco_entrega.st2_complemento,
           "tipoLogradouro": endereco_entrega.st2_logradouro,
		       "logradouro": endereco_entrega.st2_endereco,
           "numero": endereco_entrega.st2_numero,
           "referencia": endereco_entrega.st2_ponto_referencia,
           "uf": endereco_entrega.st2_estado
        },
        "nome": $scope.formParams.st1_nome,
        "numeroProposta": $scope.numero_proposta,
        "setorEVA": $scope.setorEVA,
        "regAscEVA": $scope.regEVA,
        "regAscIndicada": $scope.formParams.registro_indicante,
        "voltagem": $scope.formParams.st1_voltagem,
        "imagem": $scope.json_arquivos
      }
    };

    return JSON.stringify(json);

  };

}]);

/* ============== Função básica para calcúlo do tamanho dos arquivos inseridos */
function formatFileSize(bytes,decimalPoint) {
   if(bytes == null) return '0 Bytes';
   var k = 1000,
       dm = decimalPoint || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/* Validação de Data de nascimento */
function checkDate( date ) {

  var ardt = date.split("/");
  var erro = false;
  var ano_atual = (new Date()).getFullYear();

  if ( ardt[0] > 31 ){
    erro = true;
  }

  if ( ardt[1] > 12 ){
    erro = true;
	  console.log(ardt[1]);
  }

  if ( ardt[2] < 1900 || ardt[2] > ano_atual ){
    erro = true;
  }
	
	
  return erro;
  
}

/* Retorna a idade da pessoa */
function getIdade( date ) {

    var d = new Date,
    ano_atual = d.getFullYear(),
    mes_atual = d.getMonth() + 1,
    dia_atual = d.getDate();

    var ardt = date.split("/");

    var ano_aniversario = +ardt[2];
    var mes_aniversario = +ardt[1];
    var dia_aniversario = +ardt[0];

    var quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;

}

/* Validador de CPF */
function checkCPF( cpf = "00000000000" ) {

  var Soma;
  var Resto;
  var i;
  Soma = 0;
  if (
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) return false;
    
  for (i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;
  
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10)) ) {
      return false;
    } 
  
  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
  
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11) ) ) {
      return false;
    } else {
      return true;
    }

}

/* Modal mensagem de erro */
function showModal( title, msg ) {

  $('#modalMSG').modal('show');
  $('#modalMSG').find('.modal-title').text(title);
  $('#modalMSG').find('.modal-body').text(msg);

}

/* Retorna o base64 da imagem */
function getBase64(file, onLoadCallback) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = onLoadCallback;
  reader.onerror = function(error) {
      console.log('Error when converting PDF file to base64: ', error);
  };
}