$(document).ready(function() {
	
	function chechAuth(){
		$('.actions-panel').removeClass('active');
		if(localStorage.getItem('token') && localStorage.getItem('login')){
			$('.user-panel').addClass('active');
		}else{
			$('.auth-panel').addClass('active');
		}
	}
	function dataTpl(userData){
		$tpl = $('.user-data-wrap');
		$('[data-item]',$tpl).each(function(index, el) {
			var item = $(this).data('item'),
				type = $(this).data('type');
			if(item && type){
				switch(type){
					case 'text':
						$('[data-item="'+item+'"]', $tpl).text(userData[item]);
						break;
					case 'img':
						$('[data-item="'+item+'"]', $tpl).attr('src',userData[item]);
						break;
 					default:
				}
			}	
		});
		if(userData.gallery && userData.gallery.length){
			var gallery = userData.gallery,
				$galleryHtml = $('<div class="row"></div>');
			for(img in gallery){
				$galleryHtml.append('<div class="col-sm-6"><img class="thumbnail img-responsive" alt="'+gallery[img].title+'" src="'+gallery[img].url+'">');
			}
			$('.user-gallery', $tpl).html($galleryHtml);
		}
		// for(var key in userData){
		// 	console.log(key)
		// 	$('[data-item="'+key+'"]').text(userData[key]);
		// }
	}
	
	chechAuth();

	$('form').submit(function(e) {
		e.preventDefault();
		var $this = $(this);
		$.ajax({
			url: 'http://test5.itsites.ru/api.php',
			type: 'POST',
			dataType:'json',
			data:  $this.serialize(), // Для авторизації
			// data:  {
			// 	login: 'Login from localStorage',
			// 	token: 'token from localStorage',
			// 	action: 'get_data',
			// }, // Для Отримання даних
			success:function(responce){
				console.log(responce);
				if(responce.status){
					localStorage.setItem('token', responce.token);
					localStorage.setItem('login', responce.login);
					chechAuth();
				}else{
					alert(responce.message)
				}
			},
		})
	});
	$('.getDataBtn').click(function(event) {
		var $this = $(this);
		$.ajax({
			url: 'http://test5.itsites.ru/api.php',
			type: 'POST',
			dataType:'json',
			data:  {
				login: localStorage.getItem('login'),
				token: localStorage.getItem('token'),
				action: 'get_data',
			}, 
			success:function(responce){
				if(responce.status){
					var userData = responce.user_data;
					console.log(userData)
					// $('body').append(dataTpl(userData));
					dataTpl(userData)
				}else{
					alert(responce.message)
				}
			},
		})
	});
	$('.logOutBtn').click(function(event) {
		localStorage.removeItem('token');
		localStorage.removeItem('login');
		chechAuth();
	});



});

