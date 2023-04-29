$(document).ready(function() {
    $('#image-input').on('change', function() {
      var file = $(this)[0].files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        $('.preview-image-box').removeClass('d-none')
        $('.preview-image').attr('src', e.target.result);
      }
      reader.readAsDataURL(file);
    });
  });


  $('.add-content').on('click', function() {
    
      $('.blog-form').append(`<div class="blog-content-div">

      <div class="mb-3">
          <label for="image" class="form-label">Image:</label>
          <input type="file" id="image" name="files" class="form-control" >
      </div>

      <div class="mb-3">
          <label for="title" class="form-label">Content:</label>
          <textarea class="blog-content" name="" id="" cols="30" rows="20"></textarea>
      </div>

  </div>
      `)
  })