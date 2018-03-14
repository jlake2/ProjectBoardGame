$(document).ready(function () {
    $('#submit-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url : $(this).attr('action') || window.location.pathname,
            type: "post",
            data: $(this).serialize(),
            success: function (data) {
		document.getElementById('title-input').value="";
		document.getElementById('scenario-input').value="";
		alert("Submitted!");
            },
            error: function (jXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
});
