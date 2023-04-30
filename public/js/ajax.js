$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
    }
});

$('#login-form').on('submit', function(e) {

    e.preventDefault()

    const button = $('.login-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Please wait...')
        },
        success: function(response) {
            window.location.href = '/admin/blog'
        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'Incorrect username or password',
            });
            button.html('Send')
        }
    })
    
})

$('#comment-form').on('submit', function(e) {

    e.preventDefault()

    const button = $('.comment-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Please wait...')
        },
        success: function(data) {

            const date = new Date(data.comment.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'});
            
            $('.commentlist').append(`<li class="depth-1 comment">
            <div class="comment__avatar">
                <img class="avatar" src="https://ui-avatars.com/api/?length=1&name=${data.comment.commenter}" alt="" width="50" height="50">
            </div>
            <div class="comment__content">
                <div class="comment__info">
                    <div class="comment__author">${data.comment.commenter}</div>
                    <div class="comment__meta">
                        <div class="comment__time">${formattedDate}</div>
                        <div class="comment__reply">
                            <a class="comment-reply-link" href="#0">Reply</a>
                        </div>
                    </div>
                </div>
                <div class="comment__text">
                    <p>${data.comment.content}</p>
                </div>
            </div>
        </li>`)

        $('#comment-form')[0].reset()

        $('.comment-count').html(data.count+ ' Comments')

        iziToast.success({
            title: 'Success',
            message: 'Thank you for your comment!',
        });

        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'Incorrect username or password',
            });
            button.html('Send')
        }
    })
    
})

$('#contact-form').on('submit', function(e) {

    e.preventDefault()

    const button = $('.contact-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Sending...')
        },
        success: function(response) {
            iziToast.success({
                title: 'OK',
                message: 'Your message is sent successfully!',
            });
            button.html('Send')
            $('#contact-form')[0].reset();
        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'An error occurred sending the message',
            });
            button.html('Send')
        }
    })
    
})