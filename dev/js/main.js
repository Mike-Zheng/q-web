var cookiesName = "ntuquestion";
var userId = "";
var numbersOfblock1 = 0;
var numbersOfblock2 = 0;
var numbersOfblock3 = 0;
$(document).ready(function() {

    somthingwrong();
    if (!readCookie(cookiesName)) {
        console.log("沒有cookies");
        $.ajax({
            url: 'http://140.112.27.43:6029/cookie',
            type: 'get'
        }).then(function(data) {
            userId = data;

        });
        $('#questionModal').modal({ backdrop: 'static', keyboard: false });

    } else {
        console.log("有cookies");
        userId = readCookie(cookiesName);
    }


    createQueston();


    $("#reset").on("click", function() {
        eraseCookie(cookiesName);

    });

    $("#postQ").on("click", function() {
        // document.getElementById("mizForm").submit();
        var i = 0;
        var j = 0;
        var k = 0;
        var data = [];
        // if ($('div:not(:has(:radio:checked))').length) {
        //     alert("請完成作答再送出");
        //     return;
        // }

        $('#block1 input:radio:checked').each(function() {
            // console.log($(this).attr("id"));
            // console.log($(this).val());
            i++;
            var ob = {};
            ob.id = $(this).attr("id");
            ob.answer = $(this).val();
            data.push(ob);
        });
        if (i == numbersOfblock1)
            postQuestion(data, 1);
        // else alert("請完成作答再送出");

        $('#block2 input:radio:checked').each(function() {
            j++;
            // console.log($(this).attr("id"));
            // console.log($(this).val());
            var ob = {};
            ob.id = $(this).attr("id");
            ob.answer = $(this).val();
            data.push(ob);
        });
        if (j == numbersOfblock2)
            postQuestion(data, 2);
        // else alert("請完成作答再送出");

        $('#block3 input:radio:checked').each(function() {
            k++;
            // console.log($(this).attr("id"));
            // console.log($(this).val());
            var ob = {};
            ob.id = $(this).attr("id");
            ob.answer = $(this).val();
            data.push(ob);
        });
        if (k == numbersOfblock3)
            postQuestion(data, 3);
        // else alert("請完成作答再送出");

    });



    $("#formButton").on("click", function() {
        var sex = $('input[name=sexRadio]:checked').val();
        var age = $("#formAge").val();
        console.log(sex);
        console.log(age);
        if (sex === undefined) {
            somthingwrong();
            return;
        }
        if (age > 90 || age < 1) {
            somthingwrong();
            return;
        }

        postForm(userId, age, sex);
        createCookie(cookiesName, userId, 1000);
        $('#questionModal').modal('hide');

    });

    //scroller
    $(document).on("scroll", onScroll);
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function() {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top + 2
        }, 500, 'swing', function() {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });

});


function createQueston() {
    // $("#mizForm").attr("action", "http://140.112.27.43:6029/add_questionarie");
    $("#block1").empty();
    $("#block2").empty();
    $("#block3").empty();

    for (var i = 1; i < 4; i++) {
        $.ajax({
            url: ' http://140.112.27.43:6029/get_question?type=' + i,
            type: 'get',
            dataType: 'json'
        }).then(function(json) {
            var data = []
            data = json;
            console.log(data);
            if (data) {
                data.forEach(function(q, i) {
                    console.log(q);
                    if (q.q_type == 1)
                        numbersOfblock1++;
                    else if (q.q_type == 2)
                        numbersOfblock2++;
                    else if (q.q_type == 3)
                        numbersOfblock3++;
                    var question = '<div id="block' + q.q_type + '-question' + q.q_id + '" class="question-pannel">' +
                        '<div class="question">' +
                        q.question +
                        '</div>' +
                        '<div class="option">' +
                        '<label class="radio-inline">' +
                        '<input type="radio" id="' + q.q_id + '" name="optradio' + q.q_id + '" value="0">差勁</label>' +
                        '<label class="radio-inline">' +
                        '<input type="radio" id="' + q.q_id + '" name="optradio' + q.q_id + '" value="1">不滿意</label>' +
                        '<label class="radio-inline">' +
                        '<input type="radio" id="' + q.q_id + '" name="optradio' + q.q_id + '" value="2">尚可</label>' +
                        '<label class="radio-inline">' +
                        '<input type="radio" id="' + q.q_id + '" name="optradio' + q.q_id + '" value="3">滿意</label>' +
                        '<label class="radio-inline">' +
                        '<input type="radio" id="' + q.q_id + '" name="optradio' + q.q_id + '" value="4">非常好</label>' +
                        '</div>' +
                        '</div>';
                    $("#block" + q.q_type).append(question);





                });
            }

        });
    }

};



function postForm(userId, age, sex) {

    $.ajax({
        type: 'POST',
        url: 'http://140.112.27.43:6029/info',
        data: {
            age: age,
            gender: sex,
            cookie_pta: userId
        },
        success: function(msg) {
            console.log('postForm:' + msg);
        }
    });
}


function postQuestion(data, blockId) {
    console.log(JSON.stringify(data));
    console.log(blockId);
    console.log(userId);
    $.ajax({
        type: 'POST',
        url: 'http://140.112.27.43:6029/add',
        data: {
            ntuquestion: userId,
            type: blockId,
            data: JSON.stringify(data)

        },
        success: function(msg) {
            console.log('postQuestion:' + msg);
        }
    });
}



// 建立cookie
function createCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
//讀取
function readCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return false;
}
//刪除
function eraseCookie(name) {
    createCookie(name, "", -1);
}

//表單錯誤訊息
function somthingwrong() {
    $("#somthingwrong").toggle();
}

function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('#miz-nav li a').each(function() {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#miz-nav li a').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }
    });
}
