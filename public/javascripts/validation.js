/**
 * Created by Zombie on 21/06/2016.
 */
$('#addReview').submit(function (e) { //Listen for submit event of review form
    $('.alert.alert-danger').hide();
    if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()){//check for any missing values
        if($('.alert.alert-danger').length){
            $('.alert.alert-danger').show();
        }else {
            $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again')
        }
        return false;
    }
});