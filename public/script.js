//AJAX:
(function() {
    $.ajax({
        url: "/data.json",
        method: "GET",
        success: function(response) {
            var myHtml = "";
            for (var i = 0; i < response.length; i++) {
                var a =
                    "<a " +
                    "href=" +
                    response[i].href +
                    ">" +
                    response[i].text +
                    "</a>";
                myHtml += a;
            }
            $("#headlines").html(myHtml);
        },
        error: function(err) {
            console.log("err: ", err);
        }
    });
})();

//Refactored jQuery code with minor correction (no class "a", just tag "a"):
(function() {
    var headlines = $("#headlines");
    var left = headlines.offset().left;
    var myReq;

    moveHeadlines();
    function moveHeadlines() {
        if (
            left <=
            -$("a")
                .eq(0)
                .outerWidth()
        ) {
            left += $("a")
                .eq(0)
                .outerWidth();
            // add to left the width of the first link
            headlines.append($("a").eq(0));
            // remove the first link and make it the last link
        }
        var moveLeft = (left -= 1.5);
        headlines.css({
            left: moveLeft + "px"
        });
        // move headlines to new position
        myReq = requestAnimationFrame(moveHeadlines);
    }

    headlines.on("mouseenter", function() {
        cancelAnimationFrame(myReq);
    });

    headlines.on("mouseleave", function() {
        requestAnimationFrame(moveHeadlines);
    });
})();
