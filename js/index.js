function locate(){
  if ($(window).scrollTop() == 0){
    window.scrollTo(0,1);
  }
  $(function() {
    $("div.lazyload").lazyload();
  });
}

function Entry(id,type, cover, title, address, position){
  this.id = id;
  this.type = type;
  this.cover = cover;
  this.title = title;
  this.address = address;
  this.position = position;

  this.toHTML = function(){
    var blogHTML = "";
    if (this.type == 1){
      blogHTML += '<div class="pick pick1" id="entry'+this.id+'"onmouseover = "getback(this);" onclick="changewidth(); tuozhan(this); ">'+
        '<div class="pickframe">'+
          '<span class="close blades thick" id="close'+this.id+'" onclick="tuozhanclick(this); setTimeout(changewidth,1050);setTimeout(changewidth,1300)"></span>'+
          '<div class="lazyload pickcover pickcover1" style="background-image: url('+this.cover+')"></div>'+
          '<div class="pickinfo pickinfo1">'+
          '<div class="pickinfo1_1"></div>'+
          '<div class="pickinfo1_2">'+this.title+'</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    } else{
      blogHTML += '<div class="pick pick2" id="entry'+this.id+'"onmouseover = "getback(this);" onclick=" changewidth(); tuozhan(this);">'+
        '<div class="pickframe">'+
          '<span class="close blades thick" id="close'+this.id+'" onclick="tuozhanclick(this); setTimeout(changewidth,1050);setTimeout(changewidth,1300)"></span>'+
          '<div class="lazyload pickcover pickcover2" style="background-image: url('+this.cover+')"></div>'+
          '<div class="pickinfo pickinfo2">'+
          '<div class="pickinfo2_1"></div>'+
          '<div class="pickinfo2_2">'+this.title+'</div>'+
          '</div>'+
        '</div>'+
      '</div>';
      }
    return blogHTML;
  }
}

function showEntry(){
  var i = backbody.length-1, entryListHTML = "";
  while (i > -1) {
    entryListHTML += backbody[i].toHTML();
    i--;
  }
document.getElementById("back").innerHTML = entryListHTML;
}

function changewidth() {
  var i = checklist.length - 1;
  while (i > -1){
    var brother = document.getElementById("entry"+(checklist[i].id + 1));
    var benzun = document.getElementById("entry"+(checklist[i].id));
    var check = back.clientWidth- brother.offsetWidth - brother.offsetLeft;
    if (check == 225){
    benzun.style.width = "210px";
    $("#entry"+checklist[i].id+"> .pickframe > .pickinfo").addClass('pickinfo13').removeClass('pickinfo');
    } else {
    benzun.style.width = "430px";
    $("#entry"+checklist[i].id+"> .pickframe > .pickinfo13").addClass('pickinfo').removeClass('pickinfo13');
    }
    i--;
  }
}

function tuozhan(item) {
  // 获取当前全局环境下处于拓展状态的新闻块
  var Id = (item.id).split('entry')[1];
  tuozhanId = Id;

  // 获取当前新闻块位置
  var topp = document.getElementById(item.id).offsetTop;
  var leftt = document.getElementById(item.id).offsetLeft;


  // 立即将当前新闻块切换为pick3属性(动画效果,z-index)，同时设置位置(否则会失去滑动过程)
  $(item).addClass("pick3").removeClass("pick");
  document.getElementById(item.id).style.top = topp -10 + "px";
  document.getElementById(item.id).style.left = leftt -10 + "px";

  // 去掉新闻块封面底栏
  var clearr = document.getElementById(item.id).firstChild.childNodes;
  $(clearr[1]).css("padding-bottom","var(--height)");
  $(clearr[2]).css("display","none");

  // 加入pick4属性以进行扩展，改变backoverflow设置以显示全部文章
  $(item).addClass("pick4");
  $("#back").css("overflow","visible");
  document.getElementById(item.id).style.top = $(window).scrollTop() + "px";
  document.getElementById(item.id).style.left = 0 + "px";

  // 将关闭标签设为可见，同时调整文章封面位置
  var index = (item.id).split('entry')[1] - 1;
  $("#"+ item.id + "> .pickframe >.close").css("visibility","visible");
  if (backbody[index].position != null) {
    $("#"+ item.id + "> .pickframe > .pickcover").css("background-position",backbody[index].position);
  }

  // 去掉新闻块的onclick事件以免在单击关闭时再次触发(onmouseover事件仍然保留)
  $(item).removeAttr("onclick");

  // 改变新闻块的height以完整显示新闻
  $(item).css("height","auto");

  // 在新闻块拓展后创建模版层,加到back底下并添加onclick事件
  var mengban = document.createElement("div");
  mengban.id = "mengban";
  document.getElementById("back").appendChild(mengban);
  $('#mengban').attr("onclick","tuozhanclickMengban();guiwei();setTimeout(changewidth,1050);setTimeout(changewidth,1300);");

  // 添加新闻块的导语块，ajax异步读取文章数据
  var intro = document.createElement("div");
  intro.id = "intro";
  intro.innerHTML = backbody[index].title;
  var article = document.createElement("div");
  article.id = "article";
  $.ajax({
    url:backbody[index].address,
    type:'get',
    success:function(res){
        $('#article').html($(res));
    }
  });
  var thisdiv = document.getElementById(item.id);
  thisdiv.appendChild(intro);
  thisdiv.appendChild(article);

  // 全局getback状态调为1，onmouseover事件不会被触发
  status = 1;
  }

function tuozhanclick(item){
  document.getElementById("back").removeChild(document.getElementById("mengban"));
  var blockId = "entry" + (item.id).split('close')[1];
  var getback = document.getElementById(blockId).firstChild.childNodes;
  if (backbody[(item.id).split('close')[1] - 1].type == 1){
    $(getback[1]).css("padding-bottom","var(--height)")
  } else {
    $(getback[1]).css("padding-bottom","calc(var(--height)*0.75)")
  }
  $(getback[2]).css("display","block");
  var thisBlock = document.getElementById(blockId);
  thisBlock.removeChild(document.getElementById("intro"));
  thisBlock.removeChild(document.getElementById("article"));
  $("#"+blockId).addClass("pick").removeClass("pick4").removeClass("pick3");
  $(item).css("visibility","hidden");
  $("#"+blockId).css("top","");
  $("#"+blockId).css("left","");
  status = 0;
  }

function tuozhanclickMengban(){
  document.getElementById("back").removeChild(document.getElementById("mengban"));
  var blockId = "entry" + tuozhanId;
  var getback = document.getElementById(blockId).firstChild.childNodes;
  if (backbody[tuozhanId - 1].type == 1){
    $(getback[1]).css("padding-bottom","var(--height)")
  } else {
    $(getback[1]).css("padding-bottom","calc(var(--height)*0.75)")
  }
  $(getback[2]).css("display","block");
  var thisBlock = document.getElementById(blockId);
  thisBlock.removeChild(document.getElementById("intro"));
  thisBlock.removeChild(document.getElementById("article"));
  $("#"+blockId).addClass("pick").removeClass("pick4").removeClass("pick3");
  $("#"+blockId).css("top","");
  $("#"+blockId).css("left","");
  $("#close"+tuozhanId).css("visibility","hidden");
  status = 0;
}

function getback(item){
  if (status == 0){
  $(item).attr("onclick","tuozhan(this); changewidth();");
  }
}

function guiwei(){
  $('html, body').animate({scrollTop: $("#entry"+tuozhanId).offset().top}, 0.5)
  //window.location.hash = "#entry"+tuozhanId;
}

function sidepush() {
  if (document.getElementById("fuzhu").style.display == "none") {
    $("#bianlan").addClass("bianlan2").removeClass("bianlan1");
    document.getElementById("sideicon").src = "./icon/side2.png";
    document.getElementById("fuzhu").style.display = "inline";
  } else {
    $("#bianlan").addClass("bianlan1").removeClass("bianlan2");
    document.getElementById("sideicon").src = "./icon/side1.png";
    document.getElementById("fuzhu").style.display = "none";
  }
}

function dianji(){
  document.body.addEventListener('touchstart', function () { });
}
