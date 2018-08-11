
browser.runtime.onMessage.addListener(

    function (request, sender) {
        if (request.line == 'countparas') {
            toGetElement();
        }
    });

document.body.addEventListener('DOMSubtreeModified', function () {
    // document.title = 'DOM Changed at ' + new Date();
    toGetElement();
}, false);

function toGetElement() {
    var el = document.querySelectorAll(".im_dialog");
    var ll = el.length;
    var xx = 0;
    var what = 'contact';
    if (el != undefined && el.length > 0) {
        let index = 0;

        for (index = 0; index < el.length; index++) {
            var gg = el[index].getElementsByTagName("span");

            if (what == 'contact') {
                // var nx = parseFloat(gg[0].innerHTML
                if (parseFloat(gg[0].innerHTML) > 0) {
                    xx = xx + 1;
                } else {
                    xx = xx + 0;
                }
            } else {
                // xx = xx + parseFloat(gg[0].innerHTML);
                xx = 99;
            }
        }
        browser.runtime.sendMessage({ count: xx });
    } else if (el != undefined && el.length == 0) {
        browser.runtime.sendMessage({ count: 0 });
    } else {
        browser.runtime.sendMessage({ count: -1 });
    }
}