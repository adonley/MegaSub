$(document).ready(function() {

    $("#mega-form").on('submit', ((event) => {
        event.preventDefault();
        const twitchName = $("#twitchName").val();
        const steam64 = $("#steam64").val();

        $.post("/", {
                twitchName: twitchName,
                steam64: steam64
            }, () => {
                window.href = "/registered";
            });
    }));
});