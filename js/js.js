window.onload=function(){
    $("#cabecalho").hide();
    $("#user").hide();
    $("#pub").hide();
    $("#foto").hide();
    $("#exibeFoto").attr('src', '');
    $("#novocadastro").hide();
    $("#btnCadastrar").attr('disabled', 'disabled');
    
    $("#cad_email").change(function() {
        
        
        if($("#cad_email").val()=="" || $("#cad_email").val().indexOf('@')==-1 || $("#cad_email").val().indexOf('.')==-1)
        {
            navigator.notification.alert("Por favor, informe um E-MAIL válido!",'','Mensagem');
            $("#cad_email").focus();

        } else{


            $.ajax({
                url:'https://caiowebdev.000webhostapp.com/servidor/verificaEmail.php',
                dataType:'json',
                type:'POST',
                data:{email:$("#cad_email").val()},
                success: function(r){

                    if (r.Resp==1) {
                        $("#btnCadastrar").attr('disabled', 'disabled');
                        $("#cad_email").css("color", "#FF0000");
                        $("#cad_email").css("background-color", "#fff4f4");
                    }

                    else if(r.Resp==0) {
                        
                        $("#btnCadastrar").removeAttr('disabled');
                        $("#cad_email").css("color", "#008800");
                        $("#cad_email").css("background-color", "#e9fff7");
                    }

                },

                error:function(){
                    navigator.notification.alert("Houve um erro de conexão com o banco de dados :(!!!",'','Erro!!');
                    $("#btnCadastrar").attr('disabled', 'disabled');
                }
            })
        }
    });
}

function verificaUsuario(){
    $.ajax({
        url:"https://caiowebdev.000webhostapp.com/servidor/consultaUser.php",
        dataType:"json",
        type:"POST",
        data:{
            usuario:$("#usuario").val(),
            senha:$("#senha").val()
        },
        success:function(r){
            if(r.Resp == 0){
                navigator.notification.alert("Usuário não existe!\nVerifique o usuário/senha.",'','Mensagem');
            }else if(r.Resp == 1){
                localStorage.setItem("Cod", r.Cod);
                localStorage.setItem("Nome", r.Nome);
                localStorage.setItem("Email", r.Email);
                localStorage.setItem("Perfil", r.Perfil);
                
                inicio();
                publicacoes();
            }
        },
        error:function(e){
            navigator.notification.alert("Houve um erro de conexão com o banco de dados :(!!!",'','Erro!!');
        }
    })
}

function inicio(){
    $("#logon").hide();
    $("#cabecalho").show();
    $("#user").show();
    
    var Nome = localStorage.getItem("Nome");
    var Perfil = localStorage.getItem("Perfil");
    
    var foto = '<img class="foto" src="https://caiowebdev.000webhostapp.com/uploads/' + Perfil + '" style="width: 80%; height: auto;">';
    var nome = '<strong>' + Nome + '</strong><br><br>';
    
    $("#Perfil").html(foto);
    $("#Nome").html(nome);
}

function publicacoes(){
    $.ajax({
        url:"https://caiowebdev.000webhostapp.com/servidor/consultaPostagens.php",
        dataType:"json",
        //type:"POST",
        /*data:{
            usuario:$("#usuario").val(),
            senha:$("#senha").val()
        },*/
        success:function(r){
            //console.log(r);
            var total = r.length;
            var i;
            var postagens = "";
            
            for(i=0;i<total;i++){
                if(i > 0){
                    postagens += '<hr>';
                }
                if (localStorage.getItem("Cod", r.Cod)==r[i].codUser) {
                    var usuario = "Você";
                }else{
                    var usuario = r[i].usuario;
                }
                
                postagens += '<div style="width: 100%; margin-top: 20px;"><img class="perfil" src="https://caiowebdev.000webhostapp.com/uploads/' + r[i].img_user + '">';
                postagens += '<span class="dadosFoto">'+
                                 '<strong>' + usuario + '</strong>' +
                             '</span>';
                if (localStorage.getItem("Cod", r.Cod)==r[i].codUser) {
                    id=r[i].codPub;
                    postagens+='<a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="excluir(' +id + ')" style="float: right; top: -10px !important;">Delete</a></div>'; 
                }
                postagens += '<div style="width: 100%;"><img src="https://caiowebdev.000webhostapp.com/uploads/' + r[i].imagem + '" style="width: 100%;"></div>';
                postagens += '<div style="width: 100%; text-align: center; margin-top: 10px;"><span>' + r[i].comentario + '</span></div>';
                
            }
            
            $("#pub").html(postagens);
            $("#pub").show();
            
            
        },
        error:function(e){
            navigator.notification.alert("Houve um erro de conexão com o banco de dados :(!!!",'','Erro!!');
        }
    })
}

function publicar(){
    navigator.notification.confirm(
        'Nova foto ou abrir a galeria?',
        resposta,
        'Publicação',
        ['Galeria','Câmera']
    )
}

function resposta(r){
            
    if (r==2){
        fazFoto();
    }
	else if(r==1){
		abrirGaleria();
    }
}

function fazFoto(){
    
     var opFoto = {
         quality:50,
         sourceType:Camera.PictureSourceType.CAMERA,
         destinationType:Camera.DestinationType.FILE_URI,
         saveToPhotoAlbum:true,
         encodingType:Camera.EncodingType.JPEG,
         mediaType:Camera.MediaType.PICTURE,
         targetWidth:1200,
         targetHeight:800,
         correctOrientation: true
     }
            
     navigator.camera.getPicture(fotoSucesso,fotoErro,opFoto);            
}
            
            
function fotoSucesso(foto) {
    $("#pub").hide();
    $("#foto").show();
    $("#exibeFoto").attr('src',foto);
    
    localStorage.setItem('foto',foto);
    nomeFoto();	
            
}
            
function fotoErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a câmera! Tente Novamente!','','Erro');
}

function abrirGaleria(){
            
    var opFoto = {
        quality:50,
        sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType:Camera.DestinationType.FILE_URI,
        mediaType:Camera.MediaType.PICTURE,
        correctOrientation: true
    }
            
    navigator.camera.getPicture(galeriaSucesso,galeriaErro, opFoto);
}
            
            
function galeriaSucesso(foto){
    $("#exibeFoto").attr('src', foto);
    $("#pub").hide();
    $("#foto").show();
    $("#exibeFoto").attr('src',foto);
    
    localStorage.setItem('foto',foto);
    nomeFoto();	
            
}
            
function galeriaErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a galeria! Tente Novamente!','','Erro');
}

function nomeFoto() {
    var letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var nomeFoto = '';
    for (var i = 0; i < 55; i++) {
        var rnum = Math.floor(Math.random() * letras.length);
        nomeFoto += letras.substring(rnum, rnum + 1);
    }

    localStorage.setItem('nomeFoto',nomeFoto+'.jpg');
}

function upload(){
 
    var foto = localStorage.getItem('foto');   
    var nomeFoto = localStorage.getItem('nomeFoto');
    var cod = localStorage.getItem('Cod');

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = nomeFoto;
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.value1 = $("#comentario").val();
    params.value2 = cod;
    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(foto, "https://caiowebdev.000webhostapp.com/servidor/publica.php", function(){
        $("#foto").hide();
        publicacoes();
    }, function(){
        navigator.notification.alert('Houve um erro ao tentar publicar! Tente Novamente!','','Erro');
    }, options);
}

function excluir(r){
    localStorage.setItem('excluir',r);
    
    navigator.notification.confirm(
    'Excluir a Publicação?',
    respostaExc,
    'Exclusão',
    ['Não','Sim']
    )
}



    
function respostaExc(r){  
    
    if (r==2) {
    
        var registro = localStorage.getItem('excluir');
        
    $.ajax({
        url:'https://caiowebdev.000webhostapp.com/servidor/excluir.php',
        dataType:'json',
        type:'POST',
        data:{id:registro},
        success:function(resposta){
            navigator.notification.alert('Publicação excluída com sucesso!!','','Mensagem');
            localStorage.removeItem('excluir');
            publicacoes();
        },
        error: function(){
            navigator.notification.alert('Houve um erro ao tentar excluir! Tente Novamente!','','Erro');
        }
        
    })
        
    }
}

function cadastro(){
    $("#logon").hide();
    $("#cabecalho").show();
    $("#novocadastro").show();
    
}

function fotoPerfil(){
    
    var opFoto = {
        quality:50,
        sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType:Camera.DestinationType.FILE_URI,
        mediaType:Camera.MediaType.PICTURE,
        correctOrientation: true
    }
            
    navigator.camera.getPicture(perfilSucesso,perfilErro, opFoto);
}
    

function perfilSucesso(foto){
    console.log(foto);
    localStorage.setItem('foto',foto);
    $("#fotoPerfil").html('<img src="' + foto + '" style="width:200px; height: auto;">');
    nomeFoto();	
            
}
            
function perfilErro(e) {
    navigator.notification.alert('Houve um erro ao tentar acessar a galeria! Tente Novamente!','','Erro');
}


function cadastraUsuario(){
    
    var foto = localStorage.getItem('foto');
    
    
    if($("#cad_nome").val()=="" || $("#cad_email").val()=="" ||  $("#cad_senha").val()=="" || foto==null) {
        
        navigator.notification.alert("Verifique os dados cadastrados!!",'','Atenção');
    }else {
        
         var nomeFoto = localStorage.getItem('nomeFoto');
         
         var options = new FileUploadOptions();
         options.fileKey = "file";
         options.fileName = nomeFoto;
         options.mimeType = "image/jpeg";

         var params = new Object();
         params.value1 = $("#cad_nome").val();
         params.value2 = $("#cad_email").val();
         params.value3 = $("#cad_senha").val();
         options.params = params;
         options.chunkedMode = false;

        var ft = new FileTransfer();
         ft.upload(foto, "https://caiowebdev.000webhostapp.com/servidor/insereUser.php", function(){
             
             navigator.notification.alert('Cadastro efetuado com sucesso!!','','Mensagem');
             
             $("#novocadastro").hide();
             $("#logon").show();
             localStorage.removeItem("nomeFoto");
             localStorage.removeItem("foto");
             
         }, function(){

             navigator.notification.alert('Houve um erro ao tentar publicar! Tente Novamente!','','Erro');

         }, options);
        }
        
}

function sair(){
    navigator.notification.confirm(
        'Deseja sair do app?',
        respostaSair,
        'Sair',
        ['Não','Sim']
    )
}

function respostaSair(r){
    if(r == 2){
        localStorage.clear();
        $("#cabecalho").hide();
        $("#user").hide();
        $("#pub").hide();
        $("#foto").hide();
        $("#exibeFoto").attr('src', '');
        $("#novocadastro").hide();
        $("#btnCadastrar").attr('disabled', 'disabled');
        $("input").val("");
        
        $("#logon").show();
        
        window.location.reload(true);
    }
}