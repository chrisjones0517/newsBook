$(document).ready(() => {

    $('#loading').hide();

    $('#save-article').on('click', (e) => {
        e.preventDefault();

    });

    $('#scrapeBtn').on('click', (e) => {
        e.preventDefault();
        $('#scrapeBtn').hide();
        $('#loading').show();
        $.ajax({
            url: '/scrape',
            method: 'GET',
        }).then(() => {
            $.ajax({
                url: '/count',
                method: 'GET'
            }).then((res) => {

                if (res.numArticles) {
                    $('#modalMessage').text(`You have added ${res.numArticles} article(s)!`);
                } else {
                    $('#modalMessage').text('No new articles were found. Please try again tomorrow.');
                }
                $('#loading').hide();
                $('#scrapeBtn').show();
                $('#scrapeModal').modal('show');
            });
        });
    });

    $('.save-article').on('click', function () {
        let heading = $(this).siblings('a').text();
        let url = $(this).siblings('a').attr('href');
        let summary = $(this).parent().parent().siblings().children().text();
        $.ajax({
            url: '/saved/save',
            method: 'POST',
            data: {
                url: url,
                heading: heading,
                summary: summary
            },
            dataType: 'json'
        }).then((res) => {
            $('#saveMessage').text(res.msg);
            $('#saveModal').modal('show');
        });
    });

    $('#modalClose').on('click', (e) => {
        e.preventDefault();
        window.location.reload();
    });

    $('#modalConfirm').on('click', (e) => {
        e.preventDefault();
        window.location.reload();
    });

    $('.comment-btn').on('click', function () {
        let heading = $(this).parent().siblings('div').children().children().text();
        $('#article-heading').text(heading);
        $.ajax({
            url: '/saved/display-comments',
            method: 'POST',
            data: {
                heading3: heading
            },
            dataType: 'json'
        }).then((res) => {
            $('.comment-display').empty();
            if (res) {
                res.forEach((item) => {
                    $('.comment-display').append(`
                        <div class="row comment-box m-2">
                            <div class="col-9">
                                <p>${item.message}</p>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-danger float-right delete-comment">DELETE</button>
                            </div>
                        </div>
                    `);
                });
            }
            $('#comments-modal').modal('show');
        });

    });

    $('.comment-display').on('click', '.delete-comment', function (e) {
        e.preventDefault();
        let heading4 = $(this).parent().parent().parent().prev().children().text();
        let comment2 = $(this).parent().siblings().children().text();

        $.ajax({
            url: '/saved/delete-comment',
            method: 'POST',
            data: {
                heading4: heading4,
                comment2: comment2
            },
            dataType: 'json'
        }).then((res) => {
            window.location.reload();
        });
    });

    $('.delete-article-btn').on('click', function () {

        let deleted = $(this).parent().siblings('div').children().children().text();

        $.ajax({
            url: '/saved/delete-article',
            method: 'POST',
            data: {
                heading: deleted
            },
            dataType: 'json'
        }).then((res) => {
            window.location.reload();
        });
    });

    $('.save-comment').on('click', (e) => {
        e.preventDefault();
        let heading2 = $('#article-heading').text();
        let comment = $('#comment-input').val();

        $.ajax({
            url: '/saved/save-comment',
            method: 'POST',
            data: {
                heading2: heading2,
                comment: comment
            },
            dataType: 'json'
        }).then(() => {
            window.location.reload();
        });
    });

});